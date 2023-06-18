"use client";

import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}
const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div
      className="
  z-[100]
  "
    >
      <label
        className="
        block
      text-sm
      font-medium
      leading-6
      text-white"
      >
        {label}
      </label>
      <div className="mt-2 text-[#1F2833]">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
              color:"#1F2833",
            }),
          }}
          className="bg-red text-[#1F2833]"
        />
      </div>
    </div>
  );
};

export default Select;
