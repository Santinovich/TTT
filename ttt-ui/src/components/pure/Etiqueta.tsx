import "./Etiqueta.css";
import { ReactNode } from "react";
import { defaultEtiquetaColor, EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";

function textColorBasedOnBackground(backgroundColor: string) {
  backgroundColor = backgroundColor.substring(1);
  const r = parseInt(backgroundColor.substring(0,2), 16); // 0 ~ 255
  const g = parseInt(backgroundColor.substring(2,4), 16);
  const b = parseInt(backgroundColor.substring(4,6), 16);

  const srgb = [r / 255, g / 255, b / 255];
  const x = srgb.map((i) => {
    if (i <= 0.04045) {
      return i / 12.92;
    } else {
      return Math.pow((i + 0.055) / 1.055, 2.4);
    }
  });

  const L = 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2];
  return L > 0.179 ? "#000" : "#fff";
}

function Etiqueta({ children, etiqueta, onClick }: { children?: ReactNode; etiqueta: EtiquetaDto; onClick?: () => void }) {

    return (
        <div
            style={etiqueta.color ? 
                {
                    backgroundColor: `#${etiqueta.color}`,
                    color: textColorBasedOnBackground(`#${etiqueta.color}`),
                } : 
                {
                    backgroundColor: defaultEtiquetaColor,
                    color: textColorBasedOnBackground(defaultEtiquetaColor),
                }
            }
            key={etiqueta.id}
            className="etiqueta"
            onClick={onClick ? onClick : undefined}
        >
            <span>{etiqueta.nombre}</span> {children ? children : null}
        </div>
    );
}

export default Etiqueta;