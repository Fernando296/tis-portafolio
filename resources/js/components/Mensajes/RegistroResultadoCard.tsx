import React from "react";
import successIcon from "../../assets/Registro/exito.png";
import errorIcon from "../../assets/Registro/error.png";

type Props = {
  tipo: "success" | "error";
  mensaje: string;
  onVolver?: () => void;
};

export default function RegistroResultadoCard({
  tipo,
  mensaje,
  onVolver,
}: Props) {
  const esExito = tipo === "success";

  return (
    <div
      className={`w-[290px] rounded-[22px] px-8 py-9 text-center shadow-[0_10px_25px_rgba(0,0,0,0.18)] ${
        esExito ? "bg-[#dce7e7]" : "bg-[#efd7dc]"
      }`}
    >
      <img
        src={esExito ? successIcon : errorIcon}
        alt={esExito ? "Registro exitoso" : "Registro con error"}
        className="mx-auto mb-3 h-[58px] w-[58px] object-contain"
      />

      <p className="text-[15px] font-semibold leading-5 text-[#6f6f6f]">
        {mensaje}
      </p>
    </div>
  );
}