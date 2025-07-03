import "./DropdownMenu.css";

interface element {
    key: number | string;
    value: string | number;
}

interface DropdownMenuProps {
  elements: element[];
  onSelect?: (selectedElement: string | number) => void;
}

function DropdownMenu({ elements, onSelect }: DropdownMenuProps) {
  return (
    <div className="dropdown-menu">
      <div className="menu-list">
          {elements.map((element) => {
            return (
              <div className="menu-list-item" key={element.key} onMouseDown={() => { if (onSelect) onSelect(element.key);}}>
                {element.value}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default DropdownMenu;
