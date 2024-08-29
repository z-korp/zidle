import React, { useState, useEffect } from 'react';
import { SpriteAnimator } from 'react-sprite-animator';

// Importer les ressources pour le chevalier
import knight_attack_large from "/assets/knight_attack_large.png";
import knight_idle_large from "/assets/Warrior_Blue.png";
import knight_run from "/assets/knight_walk_large.png";

// Importer les ressources pour le gobelin (à remplacer par les vrais chemins)
import archer_attack from "/assets/archer_attack.png";
import archer_idle from "/assets/archer_idle.png";
import archer_run from "/assets/archer_run.png";
import pawn_attack from "/assets/pawn_attack.png";
import pawn_idle from "/assets/pawn_idle.png";
import pawn_run from "/assets/pawn_run.png";


// Définir l'énumération pour les types de mobs
export enum MobType {
  Knight = "knight",
  Pawn = "pawn",
  Archer = "archer",
}

// Définir l'énumération pour les types d'animations
export enum AnimationType {
  Attack = "attack",
  Idle = "idle",
  Run = "run",
}

interface AnimationConfig {
  sprite: string;
  frameCount: number;
}

// Configurer les animations pour chaque type de mob
const animations: Record<MobType, Record<AnimationType, AnimationConfig>> = {
  [MobType.Knight]: {
    [AnimationType.Attack]: { sprite: knight_attack_large, frameCount: 6 },
    [AnimationType.Idle]: { sprite: knight_idle_large, frameCount: 6 },
    [AnimationType.Run]: { sprite: knight_run, frameCount: 6 },
  },
  [MobType.Archer]: {
    [AnimationType.Attack]: { sprite: archer_attack, frameCount: 6 }, // Ajustez le frameCount si nécessaire
    [AnimationType.Idle]: { sprite: archer_idle, frameCount: 6 },
    [AnimationType.Run]: { sprite: archer_run, frameCount: 6 },
  },
  [MobType.Pawn]: {
    [AnimationType.Attack]: { sprite: pawn_attack, frameCount: 6 }, // Ajustez le frameCount si nécessaire
    [AnimationType.Idle]: { sprite: pawn_idle, frameCount: 6 },
    [AnimationType.Run]: { sprite: pawn_run, frameCount: 6 },
  },
};

interface AnimatedSpriteProps {
  width: number;
  height: number;
  scale?: number;
  fps: number;
  currentAnimation: AnimationType;
  mobType: MobType;
}

const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({
  width,
  height,
  scale = 1,
  fps,
  currentAnimation,
  mobType,
}) => {
  const [key, setKey] = useState(0);
  const { sprite, frameCount } = animations[mobType][currentAnimation];

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [currentAnimation, mobType]);

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