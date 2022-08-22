import { Combobox } from "@headlessui/react";
import { useState } from "react";

type SearchBoxProps = {
  selected: string;
  onChange(select: string): void;
  options: string[];
  inputClassName?: string;
};

const SearchBox = ({ selected, options, onChange, inputClassName }: SearchBoxProps) => {
  const [query, setQuery] = useState("");

  const filteredOptions = query === "" ? options : options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative">
        <Combobox.Input className={inputClassName} placeholder="Assigned" onChange={(e) => setQuery(e.target.value)} />
        <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black">
          {filteredOptions.map((option) => (
            <Combobox.Option className={({ active }) => `relative cursor-default select-node py-2 pl-10 pr-4 ${active ? "bg-teal-600 text-white" : "text-gray-900"}`} key={option} value={option}>
              {option}
            </Combobox.Option>
          ))}
          {query.length > 0 && (
            <Combobox.Option value={query} className={({ active }) => `relative cursor-default select-node py-2 pl-10 pr-4 ${active ? "bg-teal-600 text-white" : "text-gray-900"}`}>
              Create &quot;{query}&quot;
            </Combobox.Option>
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default SearchBox;
