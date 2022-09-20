import { motion } from "framer-motion";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useEditorContext } from "../../contexts/Editor";
import { keyColourReference } from "../../pages/reference";
import settingsModalStyles from "./SettingsModal.module.css";

interface SettingsModalProps {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  trigger,
  setTrigger,
}) => {
  const editorCtx = useEditorContext();
  const [opacity, setOpacity] = useState(0);
  const [url, setUrl] = useState(editorCtx ? editorCtx.settings.url : "");
  const [title, setTitle] = useState(editorCtx ? editorCtx.settings.title : "");
  const [key, setKey] = useState(editorCtx ? editorCtx.settings.key : "C");
  const [tuning, setTuning] = useState(editorCtx ? editorCtx.settings.tuning : ["", "", "", "", "", ""]);

  const handleSave = () => {
    if (!title || !url || tuning.includes("")) {
      return;
    }
    
    const newSettings = {
      url: url,
      title: title,
      key: key,
      tuning: tuning
    }
    editorCtx?.setSettings(newSettings);
    setTrigger(false);
  };

  const handleTuningChange = (value: string, targetIndex: number) => {
    const alphabet = "A B C D E F G a b c d e f g A# C# D# F# G# a# c# d# f# g# Ab Bb Db Eb Gb ab bb db eb gb";
    
    if (alphabet.includes(value)) {
      const newTuning = tuning.map((note, index) => {
        if (targetIndex === index) {
          if (value.length > 1 && value.slice(-1) === 'b') {
            return value.charAt(0).toUpperCase() + value.slice(1);
          }
          return value.toUpperCase();
        }
  
        return note;
      });
  
      setTuning(newTuning);
    }
  };

  useEffect(() => {
    if (trigger) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [trigger]);

  return (
    <>
      <motion.div
        animate={{ opacity: opacity }}
        className={settingsModalStyles["settings-modal-background"]}
      />
      <motion.div
        animate={{ opacity: opacity }}
        className={settingsModalStyles["settings-modal-root"]}
      >
        <div className={settingsModalStyles["settings-modal-form-fc"]}>
          <h1>settings.</h1>
          <div className={settingsModalStyles["settings-modal-inputs-fc"]}>
            <div className={settingsModalStyles["settings-modal-input-fc"]}>
              <label htmlFor="url">url</label>
              <input
                type="text"
                value={url}
                className={settingsModalStyles["settings-modal-input"]}
                onFocus={() => editorCtx?.setInputFocus(true)}
                onBlur={() => editorCtx?.setInputFocus(false)}
                onChange={(e) => setUrl(e.currentTarget.value)}
              />
            </div>
            <div className={settingsModalStyles["settings-modal-input-fc"]}>
              <label htmlFor="title">title</label>
              <input
                type="text"
                maxLength={10}
                value={title}
                className={settingsModalStyles["settings-modal-input"]}
                onFocus={() => editorCtx?.setInputFocus(true)}
                onBlur={() => editorCtx?.setInputFocus(false)}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
            <div className={settingsModalStyles["settings-modal-input-fc"]}>
              <label htmlFor="key">key</label>
              <select
                className={settingsModalStyles["settings-modal-select"]}
                value={key}
                onChange={(e) => setKey(e.target.value)}
              >
                {Object.keys(keyColourReference).map(
                  (key: string, index: number) => (
                    <option key={index} value={key}>
                      {key}
                    </option>
                  )
                )}
              </select>
            </div>
            <div
              className={settingsModalStyles["settings-modal-input-column-fc"]}
            >
              <label htmlFor="tuning">tuning</label>
              <div className={settingsModalStyles["settings-modal-tuning-inputs-fc"]}>
                {Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={2}
                      value={tuning[index]}
                      className={
                        settingsModalStyles["settings-modal-tuning-input"]
                      }
                      onFocus={() => editorCtx?.setInputFocus(true)}
                      onBlur={() => editorCtx?.setInputFocus(false)}
                      onChange={(e) =>
                        handleTuningChange(e.currentTarget.value, index)
                      }
                      placeholder={(6 - index).toString()}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className={settingsModalStyles["settings-modal-actions-fc"]}>
            <button
              onClick={() => setTrigger(false)}
              className={settingsModalStyles["settings-modal-exit"]}
            >
              exit
            </button>
            <button
              onClick={() => handleSave()}
              className={settingsModalStyles["settings-modal-submit"]}
            >
              save
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default SettingsModal;
