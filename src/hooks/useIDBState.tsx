"use client";
import { del, get, set } from "idb-keyval";
import { useEffect, useRef, useState } from "react";

type Subscriber<T> = (v: T) => void;

// Module-level subscribers for cross-component sync (still kept)
const subscribers = new Map<IDBValidKey, Set<Subscriber<unknown>>>();

export function useIDBState<T>(key: IDBValidKey, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  // keep latest key for async writers
  const keyRef = useRef<IDBValidKey>(key);
  keyRef.current = key;

  // load id to prevent stale loads from overwriting more recent updates
  const loadIdRef = useRef(0);

  useEffect(() => {
    // increment load id for this effect-run
    const myLoadId = ++loadIdRef.current;

    // ensure subscribers set exists
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    const subs = subscribers.get(key)!;

    // subscribe this component instance
    const localSubscriber: Subscriber<T> = (v: T) => {
      setValue(v);
    };
    subs.add(localSubscriber as Subscriber<unknown>);

    // initial load from IndexedDB
    (async () => {
      try {
        const stored = await get<T>(key);
        // if another load/run started after this one, ignore result
        if (loadIdRef.current !== myLoadId) return;

        const val = stored === undefined ? defaultValue : stored;
        setValue(val);
        setLoading(false);

        // persist default if nothing was in IDB
        if (stored === undefined) {
          // fire-and-forget
          set(key, defaultValue).catch((err) => {
            console.error("idb set error:", err);
          });
        }
      } catch (err) {
        if (loadIdRef.current !== myLoadId) return;
        console.error("idb get error:", err);
        setLoading(false);
      }
    })();

    return () => {
      // cleanup this subscriber
      subs.delete(localSubscriber as Subscriber<unknown>);
      if (subs.size === 0) {
        subscribers.delete(key);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, defaultValue]); // re-run if key or defaultValue changes

  const updateValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const computed =
        typeof newValue === "function"
          ? (newValue as (p: T) => T)(prev)
          : newValue;

      const k = keyRef.current;

      // persist asynchronously
      set(k, computed).catch((err) => {
        console.error("idb set error:", err);
      });

      // notify other subscribers for this key
      const subs = subscribers.get(k);
      if (subs) {
        for (const cb of subs) {
          // cb is setValue wrapper in other instances — call all
          try {
            cb(computed);
          } catch (e) {
            // swallow subscriber errors
            console.error("subscriber callback error", e);
          }
        }
      }

      return computed;
    });
  };

  const deleteValue = (resetToDefault = true) => {
    const k = keyRef.current;
    // delete from idb
    del(k).catch((err) => {
      console.error("idb del error:", err);
    });

    // new state after deletion (either undefined or defaultValue)
    const newState = resetToDefault ? defaultValue : (undefined as typeof defaultValue);

    // update local state
    setValue(newState);

    // notify subscribers
    const subs = subscribers.get(k);
    if (subs) {
      for (const cb of subs) {
        try {
          cb(newState);
        } catch (e) {
          console.error("subscriber callback error", e);
        }
      }
    }
  };

  return { value, updateValue, deleteValue, loading };
}