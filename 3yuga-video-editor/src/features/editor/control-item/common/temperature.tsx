import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

const Temperature = ({
  value = 0,
  onChange
}: {
  value?: number;
  onChange: (value: number) => void;
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="flex gap-2">
      <div className="flex flex-1 items-center text-sm text-muted-foreground">
        Temperature
      </div>
      <div
        className="w-32"
        style={{
          display: "grid",
          gridTemplateColumns: "45px 1fr",
          gap: "0.2rem"
        }}
      >
        <Input
          className="h-8 w-full px-2 text-center text-xs"
          type="number"
          min={-100}
          max={100}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue)) {
              setLocalValue(newValue);
              onChange(newValue);
            }
          }}
          value={localValue}
        />
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[localValue]}
          onValueChange={(e) => {
            setLocalValue(e[0]);
            onChange(e[0]);
          }}
          onValueCommit={() => {
            onChange(localValue);
          }}
        />
      </div>
    </div>
  );
};

export default Temperature;
