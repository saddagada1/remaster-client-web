import { Formik, Form } from "formik";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../utils/fetcher";
import { motion } from "framer-motion";
import createLoopModalStyles from "./CreateLoopModal.module.css";

interface CreateLoopModalProps {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}

const CreateLoopModal: React.FC<CreateLoopModalProps> = ({
  trigger,
  setTrigger,
}) => {
  const { data, error } = useSWR("../api/getChords", fetcher);
  const [selectedKey, setSelectedKey] = useState("C");
  const [position, setPosition] = useState(window.innerHeight);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (trigger) {
      setPosition(0);
      setOpacity(1);
    } else {
      setPosition(window.innerHeight);
      setOpacity(0);
    }
  }, [trigger]);

  return (
    <>
      <motion.div
        animate={{ opacity: opacity }}
        style={{pointerEvents: trigger ? "initial" : "none"}}
        onClick={() => setTrigger(false)}
        className={createLoopModalStyles["create-loop-modal-background"]}
      />
      <motion.div
        animate={{ opacity: opacity, y: position }}
        transition={{type: "spring", stiffness: 75}}
        className={createLoopModalStyles["create-loop-modal-root"]}
      >
        <Formik initialValues={{}} onSubmit={async () => {}}>
          {() => (
            <Form
              className={createLoopModalStyles["create-loop-modal-form-fc"]}
            >
              <h3>create loop.</h3>
              <div
                className={createLoopModalStyles["create-loop-modal-select-fc"]}
              >
                <label htmlFor="key">key</label>
                <select
                  className={createLoopModalStyles["create-loop-modal-select"]}
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                >
                  {data &&
                    data.keys.map((key: string, index: number) => (
                      <option key={index} value={key}>
                        {key}
                      </option>
                    ))}
                </select>
              </div>
              <div
                className={
                  createLoopModalStyles["create-loop-modal-actions-fc"]
                }
              >
                <button
                  onClick={() => setTrigger(false)}
                  className={createLoopModalStyles["create-loop-modal-exit"]}
                >
                  exit
                </button>
                <button
                  type="submit"
                  className={createLoopModalStyles["create-loop-modal-submit"]}
                >
                  create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </>
  );
};
export default CreateLoopModal;
