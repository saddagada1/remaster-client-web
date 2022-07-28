import React from "react";
import { WaveSpinner } from "react-spinners-kit";
import ldngBtnStyles from "./LoadingButton.module.css"

interface LoadingButtonProps {
  content: string,
  style: string,
  loading: boolean,
  disabled: boolean
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  content,
  style,
  loading,
  disabled
}) => {
  return (
    <button
      className={style === "inline" ? ldngBtnStyles["loading-button-inline"] : ldngBtnStyles["loading-button-block"]}
      type="submit"
      disabled={disabled}
    >
      {loading ? (
        <WaveSpinner size={2.5} color="#fff" loading={loading} sizeUnit="vmin"/>
      ) : (
        content
      )}
    </button>
  );
};
export default LoadingButton;
