import { useState } from "react";

interface SwitchProps {
  initialChecked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Switch({ initialChecked, onChange }: SwitchProps) {
  const [checked, setChecked] = useState(initialChecked);

  const handleToggle = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        checked ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
}