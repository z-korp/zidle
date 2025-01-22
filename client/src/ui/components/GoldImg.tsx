import gold from "/assets/gold.png";

interface GoldImgProps {
  className?: string;
}

const GoldImg = ({ className }: GoldImgProps) => {
  return <img src={gold} alt="Gold" className={className} />;
};

export default GoldImg;
