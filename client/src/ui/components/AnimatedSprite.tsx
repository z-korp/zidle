// components/AnimatedSprite.tsx
import React, { useState, useEffect } from 'react';
import { SpriteAnimator } from 'react-sprite-animator';
import knight_attack_large from "/assets/knight_attack_large.png";
import knight_idle_large from "/assets/Warrior_Blue.png";
import knight_run_large from "/assets/knight_defend_large.png";
import knight_jump_large from "/assets/knight_walk_large.png";

interface AnimationConfig {
  sprite: string;
  frameCount: number;
}

const animations: Record<string, AnimationConfig> = {
  attack: { sprite: knight_attack_large, frameCount: 6 },
  idle: { sprite: knight_idle_large, frameCount: 6 },
  run: { sprite: knight_run_large, frameCount: 6 },
  jump: { sprite: knight_jump_large, frameCount: 6 },
};

interface AnimatedSpriteProps {
  width: number;
  height: number;
  scale?: number;
  fps: number;
  currentAnimation: keyof typeof animations;
}

const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({
  width,
  height,
  scale = 1,
  fps,
  currentAnimation,
}) => {
  const [key, setKey] = useState(0);
  const { sprite, frameCount } = animations[currentAnimation];

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [currentAnimation]);

  return (
    <SpriteAnimator
      key={key}
      sprite={sprite}
      width={width}
      height={height}
      scale={scale}
      fps={fps}
      frameCount={frameCount}
      stopLastFrame={false}
      direction="horizontal"
      shouldAnimate={true}
    />
  );
};

export default AnimatedSprite;