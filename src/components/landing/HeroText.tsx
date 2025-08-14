"use client"
import { Box, Button, Container, Text, Title } from '@mantine/core';
import { Dots } from './Dots';
import classes from './HeroText.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Routes } from '@/routes/routes';
import { redirect } from 'next/navigation';

export function HeroText() {

  const textEffects = useMemo(() => ["Code", "Preview", "Collaborate"], []);;
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);
  
  const letterIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  useEffect(() => {

    let timeoutId = setTimeout(() => {});

    const animate = async () => {
      const word = textEffects[indexRef.current];
      let letterIndex = letterIndexRef.current;

      if (isDeletingRef.current) {
        letterIndex--;
        setDisplayText(word.slice(0, letterIndex));
        letterIndexRef.current = letterIndex;

        if (letterIndex > 0) {
          timeoutId = setTimeout(animate, 80);
        } else {
          isDeletingRef.current = false;
          indexRef.current = (indexRef.current + 1) % textEffects.length;
          timeoutId = setTimeout(animate, 300);
        }
      } else {
        setDisplayText(word.slice(0, letterIndex + 1));
        letterIndex++;
        letterIndexRef.current = letterIndex;

        if (letterIndex < word.length) {
          timeoutId = setTimeout(animate, 150);
        } else {
          isDeletingRef.current = true;
          await new Promise((r) => setTimeout(r, 1500));
          timeoutId = setTimeout(animate, 1500);
        }
      }
    };

    animate();

    return () => clearTimeout(timeoutId);
  }, [textEffects]);


  return (
    <Container mt={100} className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 30 }} />
      <Dots className={classes.dots} style={{ left: 200, top: 30 }} />
      <Dots className={classes.dots} style={{ left: 400, top: 30 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          &lt;Live{' '}
          <Text component="span" style={{fontSize: 60}} className={classes.highlight} inherit pos={'relative'}>
            <style>
              {`@keyframes blink {
                50% { opacity: 0; }
              }`}
            </style>
            {displayText}<Box
              style={{
                display: 'inline-flex',
                position: 'relative',
                top: 5,
                justifySelf: 'center',
                alignSelf: 'center',
                width: '15px',
                height: '1.8ch',
                animation: 'blink 1s step-start infinite',
                marginLeft: '2px',
              }} bg='blue.4'
            ></Box>
            <Text component='span' className={classes.highlight} inherit>/&gt;</Text>
          </Text>{' '}
          in{' '}<Text component='span' className={classes.highlight} inherit>Real</Text> time
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Collaborative code editor with live preview.
            Works seamlessly on desktop and mobile.
            No setup — just open and start coding.
            Real-time updates across all participants.
            Perfect for building, teaching, or reviewing on the go.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} size="lg" variant="default" color="gray">
            Features
          </Button>
          <Button onClick={() => redirect(Routes.projects)} variant='gradient' className={classes.control} size="lg">
            Start building
          </Button>
        </div>
      </div>
    </Container>
  );
}