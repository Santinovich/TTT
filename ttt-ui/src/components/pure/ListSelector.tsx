import "./ListSelector.css";

interface element {
    key: number | string;
    value: string | number;
}

interface ListSelectorProps {
  elements: element[];
  callback?: (selectedElement: string | number) => void;
}

function ListSelector({ elements, callback }: ListSelectorProps) {
  return (
    <div className="dropdown-menu">
      <div className="menu-list">
        <div>
          {elements.map((element) => {
            return (
              <div className="menu-list-item" key={element.key} onClick={() => { if (callback) callback(element.key);}}>
                {element.value}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListSelector;
