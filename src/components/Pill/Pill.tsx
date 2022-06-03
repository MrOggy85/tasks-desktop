
type Props = {
  name: string;
  bgColor: string;
  textColor: string;
};

const Pill = ({ name, bgColor, textColor }: Props) => {
  return (
    <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 6, backgroundColor: bgColor, color: textColor }}>{name}</div>
  );
};

export default Pill;
