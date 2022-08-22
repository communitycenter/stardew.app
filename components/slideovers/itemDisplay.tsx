import Image from "next/image";

const ItemDisplay = ({ itemID, item }: any) => {
  return (
    <div className="flex items-center space-x-2" key={itemID}>
      <Image
        src={item.iconURL}
        alt={item.name}
        width={32}
        height={32}
        quality={100}
      />
      <div className="text-sm font-semibold">{item.name}</div>
    </div>
  );
};

export default ItemDisplay;
