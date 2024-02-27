import Image from "next/image";

const Character = ({ position }) => {
  // Set the character's position based on the prop
  const characterStyle = {
    position: "fixed", // Fixed position relative to the viewport
    top: "100px", // Adjust the distance from the top of the viewport
    left: "20px",
  };

  return (
    <div style={characterStyle}>
      <Image
        src="/images/poa_character.png"
        alt="Character"
        width={115}
        height={115}
      />
    </div>
  );
};

export default Character;
