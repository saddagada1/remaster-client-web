import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import createLoopModalStyles from "./CreateLoopModal.module.css";
import { keyColourReference } from "../../pages/reference";
import { useEditorContext } from "../../contexts/Editor";

interface CreateLoopModalProps {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}

const CreateLoopModal: React.FC<CreateLoopModalProps> = ({
  trigger,
  setTrigger,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Tab");
  const [selectedKey, setSelectedKey] = useState("C");
  const [opacity, setOpacity] = useState(0);
  const editorCtx = useEditorContext();

  const handleSubmit = () => {
    if (!name) {
      return;
    } else {
      editorCtx?.createLoop(name, selectedKey, type);
      setTrigger(false);
    }
  };

  useEffect(() => {
    if (trigger) {
      setOpacity(1);
    } else {
      setOpacity(0);
      setName("");
      setType("Tab");
      setSelectedKey("C");
    }
  }, [trigger]);

  return (
    <>
      <motion.div
        animate={{ opacity: opacity }}
        style={{ pointerEvents: trigger ? "initial" : "none" }}
        onClick={() => setTrigger(false)}
        className={createLoopModalStyles["create-loop-modal-background"]}
      />
      <motion.div
        animate={{ opacity: opacity }}
        className={createLoopModalStyles["create-loop-modal-root"]}
      >
        <div className={createLoopModalStyles["create-loop-modal-form-fc"]}>
          <h3>create loop.</h3>
          <div className={createLoopModalStyles["create-loop-modal-inputs-fc"]}>
            <div
              className={createLoopModalStyles["create-loop-modal-input-fc"]}
            >
              <label htmlFor="name">name</label>
              <input
                type="text"
                maxLength={15}
                value={name}
                className={createLoopModalStyles["create-loop-modal-input"]}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </div>
            <div
              className={createLoopModalStyles["create-loop-modal-input-fc"]}
            >
              <label htmlFor="key">key</label>
              <select
                className={createLoopModalStyles["create-loop-modal-select"]}
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
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
              className={createLoopModalStyles["create-loop-modal-input-fc"]}
            >
              <label htmlFor="type">type</label>
              <select
                className={createLoopModalStyles["create-loop-modal-select"]}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Tab">Tab</option>
                <option value="Chord">Chord</option>
              </select>
            </div>
          </div>
          <div
            className={createLoopModalStyles["create-loop-modal-actions-fc"]}
          >
            <button
              onClick={() => setTrigger(false)}
              className={createLoopModalStyles["create-loop-modal-exit"]}
            >
              exit
            </button>
            <button
              onClick={() => handleSubmit()}
              className={createLoopModalStyles["create-loop-modal-submit"]}
            >
              create
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default CreateLoopModal;
