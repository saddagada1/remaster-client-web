import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import editLoopModalStyles from "./EditLoopModal.module.css";
import { keyColourReference } from "../../pages/reference";
import { LoopSchema, useEditorContext } from "../../contexts/Editor";
import { FiTrash2 } from "react-icons/fi";

interface EditLoopModalProps {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
  loop: LoopSchema;
  setLoop: Dispatch<SetStateAction<LoopSchema | null>>;
}

const EditLoopModal: React.FC<EditLoopModalProps> = ({
  trigger,
  setTrigger,
  loop,
  setLoop
}) => {
  const [name, setName] = useState(loop.name);
  const [type, setType] = useState(loop.type);
  const [selectedKey, setSelectedKey] = useState(loop.key);
  const [opacity, setOpacity] = useState(0);
  const editorCtx = useEditorContext();

  const handleDelete = () => {
    editorCtx?.deleteLoop(loop);
    setLoop(null);
    setTrigger(false);
  }

  const handleSubmit = () => {
    if (!name) {
      return;
    } else {
      const newLoop: LoopSchema = {
        id: loop.id,
        name: name,
        type: type,
        key: selectedKey,
        start: loop.start,
        end: loop.end,
        colour: keyColourReference[selectedKey],
        chord: loop.chord,
        tab: loop.tab
      }
      editorCtx?.updateLoops(newLoop);
      setLoop(null);
      setTrigger(false);
    }
  };

  useEffect(() => {
    if (trigger) {
      setOpacity(1);
    }
  }, [trigger]);

  return (
    <>
      <motion.div
        animate={{ opacity: opacity }}
        className={editLoopModalStyles["edit-loop-modal-background"]}
      />
      <motion.div
        animate={{ opacity: opacity }}
        className={editLoopModalStyles["edit-loop-modal-root"]}
      >
        <div className={editLoopModalStyles["edit-loop-modal-form-fc"]}>
          <div className={editLoopModalStyles["edit-loop-modal-header-fc"]}>
            <h1>edit loop.</h1>
            <button onClick={() => handleDelete()}><FiTrash2/></button>
          </div>
          <div className={editLoopModalStyles["edit-loop-modal-inputs-fc"]}>
            <div
              className={editLoopModalStyles["edit-loop-modal-input-fc"]}
            >
              <label htmlFor="name">name</label>
              <input
                type="text"
                maxLength={10}
                value={name}
                className={editLoopModalStyles["edit-loop-modal-input"]}
                onFocus={() => editorCtx?.setInputFocus(true)}
                onBlur={() => editorCtx?.setInputFocus(false)}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </div>
            <div
              className={editLoopModalStyles["edit-loop-modal-input-fc"]}
            >
              <label htmlFor="key">key</label>
              <select
                className={editLoopModalStyles["edit-loop-modal-select"]}
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
              className={editLoopModalStyles["edit-loop-modal-input-fc"]}
            >
              <label htmlFor="type">type</label>
              <select
                className={editLoopModalStyles["edit-loop-modal-select"]}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Tab">Tab</option>
                <option value="Chord">Chord</option>
              </select>
            </div>
          </div>
          <div
            className={editLoopModalStyles["edit-loop-modal-actions-fc"]}
          >
            <button
              onClick={() => {setTrigger(false); setLoop(null)}}
              className={editLoopModalStyles["edit-loop-modal-exit"]}
            >
              exit
            </button>
            <button
              onClick={() => handleSubmit()}
              className={editLoopModalStyles["edit-loop-modal-submit"]}
            >
              save
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
export default EditLoopModal;
