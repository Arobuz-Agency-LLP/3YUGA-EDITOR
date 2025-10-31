import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Contrast = ({
  value = 100,
  onChange
}: {
  value?: number;
  onChange: (value: number) => void;
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: number[]) => {
    const val = newValue[0];
    setLocalValue(val);
    onChange(val);
  };

  return (
    <div className="flex items-center gap-2">
      <Slider
        min={0}
        max={200}
        step={1}
        value={[localValue]}
        onValueChange={handleChange}
        className="flex-1"
      />
      <Input
        type="number"
        min={0}
        max={200}
        value={localValue}
        onChange={(e) => handleChange([parseFloat(e.target.value) || 0])}
        className="w-16 text-xs"
      />
    </div>
  );
};

export default Contrast;