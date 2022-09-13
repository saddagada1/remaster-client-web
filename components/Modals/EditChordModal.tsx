import { motion } from "framer-motion";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { Finger } from "svguitar";
import { useEditorContext } from "../../contexts/Editor";
import Chord from "../Chord/Chord";
import { Chord as ChordType } from "../Editors/helpers/ChordSelector";
import editChordModalStyles from "./EditChordModal.module.css";

interface EditChordModalProps {
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
  chord: ChordType;
  setChord: Dispatch<SetStateAction<ChordType | undefined>>
}

const EditChordModal: React.FC<EditChordModalProps> = ({
  trigger,
  setTrigger,
  chord,
  setChord
}) => {
  const [opacity, setOpacity] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<[number, number][]>(
    []
  );
  const [title, setTitle] = useState(chord.title);
  const [fingers, setFingers] = useState<Finger[]>(chord.fingers);
  const [barres, setBarres] = useState<
    { fromString: number; toString: number; fret: number }[]
  >(chord.barres);
  const [position, setPosition] = useState(chord.position);
  const [matrixWidth, setMatrixWidth] = useState(0);
  const [matrixHeight, setMatrixHeight] = useState(0);
  const [matrixColumn0Position, setMatrixColumn0Position] = useState(0);
  const [matrixColumn1Position, setMatrixColumn1Position] = useState(0);
  const [matrixColumn2Position, setMatrixColumn2Position] = useState(0);
  const [matrixColumn3Position, setMatrixColumn3Position] = useState(0);
  const [matrixColumn4Position, setMatrixColumn4Position] = useState(0);
  const [matrixColumn5Position, setMatrixColumn5Position] = useState(0);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [init, setInit] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorCtx = useEditorContext();

  const handleSubmit = () => {
    if (
      JSON.stringify(fingers) ===
        JSON.stringify([
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
          [5, 0],
          [6, 0],
        ]) ||
      !title
    ) {
      return;
    }
    const newChord = {
      title: title,
      fingers: fingers,
      barres: barres,
      position: position,
    };
    editorCtx?.updateCreatedChords(chord, newChord);
    setTrigger(false);
  };

  const handleAddBarre = () => {
    if (barres.length >= 3) {
      return;
    }
    if (selectedIndexes[0][0] > selectedIndexes[1][0]) {
      const barre = {
        fromString: selectedIndexes[0][0],
        toString: selectedIndexes[1][0],
        fret: selectedIndexes[0][1],
      };
      if (JSON.stringify(barres).includes(JSON.stringify(barre))) {
        return;
      }
      setBarres([...barres, barre]);
      setSelectedIndexes([]);
    } else {
      const barre = {
        fromString: selectedIndexes[1][0],
        toString: selectedIndexes[0][0],
        fret: selectedIndexes[0][1],
      };
      if (JSON.stringify(barres).includes(JSON.stringify(barre))) {
        return;
      }
      setBarres([...barres, barre]);
      setSelectedIndexes([]);
    }
  };

  const handleDeleteBarre = (index: number) => {
    const newBarres = barres.filter(
      (_, filteredIndex) => index !== filteredIndex
    );
    setBarres(newBarres);
  };

  const handleClick = (string: number, fret: number) => {
    if (timerRef.current === null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        handleMatrixElementClick(string, fret);
      }, 300);
    }
  };

  const handleDoubleClick = (string: number, fret: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      handleMatrixElementDoubleClick(string, fret);
    }
  };

  const handleMatrixElementClick = (string: number, fret: number | "x") => {
    if (JSON.stringify(fingers).includes(JSON.stringify([string, fret]))) {
      const newFingers = fingers.filter((finger) => finger[0] !== string);
      setFingers([...newFingers, [string, 0]]);
    } else {
      const newFingers = fingers.filter((finger) => finger[0] !== string);
      setFingers([...newFingers, [string, fret]]);
    }
  };

  const handleMatrixElementDoubleClick = (string: number, fret: number) => {
    if (selectedIndexes.length === 1) {
      if (
        JSON.stringify(selectedIndexes).includes(JSON.stringify([string, fret]))
      ) {
        setSelectedIndexes([]);
      } else if (selectedIndexes[0][1] === fret) {
        setSelectedIndexes([...selectedIndexes, [string, fret]]);
      } else {
        setSelectedIndexes([[string, fret]]);
      }
    } else {
      setSelectedIndexes([[string, fret]]);
    }
  };

  const handleReset = () => {
    setTitle(chord.title);
    setFingers(chord.fingers);
    setBarres(chord.barres);
    setPosition(chord.position);
    setSelectedIndexes([]);
  };

  useEffect(() => {
    let newFingers: Finger[] = fingers;
    for (let i = 0; i < barres.length; i++) {
      const tempFingers = newFingers.filter((finger) => !(barres[i].fromString >= finger[0] && finger[0] >= barres[i].toString))
      newFingers = tempFingers;
    }
    setFingers(newFingers);
  }, [barres, fingers])
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && init) {
      if (matrixWidth && matrixHeight) {
        setMatrixColumn0Position(
          canvas.children[0].children[0].children[0].getBoundingClientRect()
            .left -
            canvas.getBoundingClientRect().left -
            matrixWidth
        );
        setMatrixColumn1Position(
          canvas.children[0].children[0].children[1].getBoundingClientRect()
            .left -
            canvas.getBoundingClientRect().left -
            matrixWidth
        );
        setMatrixColumn2Position(
          canvas.children[0].children[0].children[2].getBoundingClientRect()
            .left -
            canvas.getBoundingClientRect().left -
            matrixWidth
        );
        setMatrixColumn3Position(
          canvas.children[0].children[0].children[3].getBoundingClientRect()
            .left -
            canvas.getBoundingClientRect().left -
            matrixWidth
        );
        setMatrixColumn4Position(
          canvas.children[0].children[0].children[4].getBoundingClientRect()
            .left -
            canvas.getBoundingClientRect().left -
            matrixWidth
        );
        setMatrixColumn5Position(
          canvas.children[0].children[0].children[5].getBoundingClientRect()
            .left -
            canvas.getBoundingClientRect().left -
            matrixWidth
        );
      } else {
        setMatrixHeight(
          canvas.children[0].children[0].children[0].getBoundingClientRect()
            .height +
            canvas.children[0].children[0].children[0].getBoundingClientRect()
              .height /
              5.33
        );
        setMatrixWidth(
          canvas.children[0].children[0].getBoundingClientRect().width / 7
        );
      }
    }
  }, [canvasRef, matrixHeight, matrixWidth, init]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (
        container.getBoundingClientRect().width >
        container.getBoundingClientRect().height
      ) {
        setCanvasWidth(container.getBoundingClientRect().height * 1.125);
      }
      setInit(true);
    }
  }, [containerRef]);

  useEffect(() => {
    if (trigger) {
      setOpacity(1);
    }
  }, [trigger]);

  return (
    <>
      <motion.div
        animate={{ opacity: opacity }}
        className={editChordModalStyles["edit-chord-modal-background"]}
      />
      <div
        className={editChordModalStyles["edit-chord-modal-root-container"]}
      >
        <motion.div
          animate={{ opacity: opacity }}
          className={editChordModalStyles["edit-chord-modal-root"]}
        >
          <h1>edit chord.</h1>
          <div className={editChordModalStyles["edit-chord-main"]}>
            <div className={editChordModalStyles["edit-chord-form"]}>
              <div
                className={editChordModalStyles["edit-chord-form-input"]}
              >
                <label htmlFor="title">title</label>
                <input
                  type="text"
                  maxLength={15}
                  value={title}
                  className={editChordModalStyles["edit-chord-modal-input"]}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </div>
              <div
                className={editChordModalStyles["edit-chord-form-input"]}
              >
                <label htmlFor="position">position</label>
                <select
                  className={
                    editChordModalStyles["edit-chord-modal-select"]
                  }
                  value={position}
                  onChange={(e) => setPosition(parseInt(e.target.value))}
                >
                  {Array(22)
                    .fill(null)
                    .map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                </select>
              </div>
              <div
                className={editChordModalStyles["edit-chord-form-input"]}
              >
                <label htmlFor="barres">barres</label>
              </div>
              <div
                className={editChordModalStyles["edit-chord-form-barres"]}
              >
                {barres.length > 0 ? (
                  barres.map((barre, index) => (
                    <div
                      key={index}
                      className={
                        editChordModalStyles["edit-chord-form-barre"]
                      }
                    >
                      <p>fret: {barre.fret}</p>
                      <button
                        onClick={() => handleDeleteBarre(index)}
                        className={
                          editChordModalStyles[
                            "edit-chord-form-inline-button"
                          ]
                        }
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                ) : (
                  <h3>no barres to display</h3>
                )}
              </div>
              <div
                className={editChordModalStyles["edit-chord-form-input"]}
              >
                <button
                  onClick={() => handleReset()}
                  className={editChordModalStyles["edit-chord-form-button"]}
                >
                  reset
                </button>
                <button
                  disabled={selectedIndexes.length < 2}
                  onClick={() => handleAddBarre()}
                  className={editChordModalStyles["edit-chord-form-button"]}
                >
                  add barre
                </button>
              </div>
              <div className={editChordModalStyles["edit-chord-form-help"]}>
                <div>
                  <FiAlertCircle />
                  <p>tap to add note</p>
                </div>
                <div>
                  <FiAlertCircle />
                  <p>double tap to select and edit barre</p>
                </div>
              </div>
            </div>
            <div
              ref={containerRef}
              className={editChordModalStyles["edit-chord-input"]}
            >
              <div
                style={{ width: canvasWidth ? `${canvasWidth}px` : "100%" }}
                className={editChordModalStyles["edit-chord-diagram"]}
              >
                <Chord
                  chord={{
                    title: title,
                    fingers: fingers,
                    barres: barres,
                    position: position,
                  }}
                  selected={false}
                />
              </div>
              <div
                ref={canvasRef}
                style={{ width: canvasWidth ? `${canvasWidth}px` : "100%" }}
                className={editChordModalStyles["edit-chord-template"]}
              >
                <Chord
                  chord={{
                    title: undefined,
                    fingers: [],
                    barres: [],
                    position: 0,
                  }}
                  selected={false}
                />
              </div>
              <div
                style={{ width: canvasWidth ? `${canvasWidth}px` : "100%" }}
                className={editChordModalStyles["edit-chord-matrix"]}
              >
                <div
                  style={{
                    width: matrixWidth,
                    height: matrixHeight,
                    left: matrixColumn0Position,
                  }}
                  className={
                    editChordModalStyles["edit-chord-matrix-column"]
                  }
                >
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => handleMatrixElementClick(index + 1, "x")}
                        className={
                          editChordModalStyles["edit-chord-matrix-element"]
                        }
                      />
                    ))}
                </div>
                <div
                  style={{
                    width: matrixWidth,
                    height: matrixHeight,
                    left: matrixColumn1Position,
                  }}
                  className={
                    editChordModalStyles["edit-chord-matrix-column"]
                  }
                >
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index + 1, 1)}
                        onDoubleClick={() => handleDoubleClick(index + 1, 1)}
                        className={
                          editChordModalStyles["edit-chord-matrix-element"]
                        }
                      >
                        <span
                          className={
                            JSON.stringify(selectedIndexes).includes(
                              JSON.stringify([index + 1, 1])
                            )
                              ? editChordModalStyles[
                                  "edit-chord-matrix-element-indicator"
                                ]
                              : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    width: matrixWidth,
                    height: matrixHeight,
                    left: matrixColumn2Position,
                  }}
                  className={
                    editChordModalStyles["edit-chord-matrix-column"]
                  }
                >
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index + 1, 2)}
                        onDoubleClick={() => handleDoubleClick(index + 1, 2)}
                        className={
                          editChordModalStyles["edit-chord-matrix-element"]
                        }
                      >
                        <span
                          className={
                            JSON.stringify(selectedIndexes).includes(
                              JSON.stringify([index + 1, 2])
                            )
                              ? editChordModalStyles[
                                  "edit-chord-matrix-element-indicator"
                                ]
                              : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    width: matrixWidth,
                    height: matrixHeight,
                    left: matrixColumn3Position,
                  }}
                  className={
                    editChordModalStyles["edit-chord-matrix-column"]
                  }
                >
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index + 1, 3)}
                        onDoubleClick={() => handleDoubleClick(index + 1, 3)}
                        className={
                          editChordModalStyles["edit-chord-matrix-element"]
                        }
                      >
                        <span
                          className={
                            JSON.stringify(selectedIndexes).includes(
                              JSON.stringify([index + 1, 3])
                            )
                              ? editChordModalStyles[
                                  "edit-chord-matrix-element-indicator"
                                ]
                              : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    width: matrixWidth,
                    height: matrixHeight,
                    left: matrixColumn4Position,
                  }}
                  className={
                    editChordModalStyles["edit-chord-matrix-column"]
                  }
                >
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index + 1, 4)}
                        onDoubleClick={() => handleDoubleClick(index + 1, 4)}
                        className={
                          editChordModalStyles["edit-chord-matrix-element"]
                        }
                      >
                        <span
                          className={
                            JSON.stringify(selectedIndexes).includes(
                              JSON.stringify([index + 1, 4])
                            )
                              ? editChordModalStyles[
                                  "edit-chord-matrix-element-indicator"
                                ]
                              : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    width: matrixWidth,
                    height: matrixHeight,
                    left: matrixColumn5Position,
                  }}
                  className={
                    editChordModalStyles["edit-chord-matrix-column"]
                  }
                >
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index + 1, 5)}
                        onDoubleClick={() => handleDoubleClick(index + 1, 5)}
                        className={
                          editChordModalStyles["edit-chord-matrix-element"]
                        }
                      >
                        <span
                          className={
                            JSON.stringify(selectedIndexes).includes(
                              JSON.stringify([index + 1, 5])
                            )
                              ? editChordModalStyles[
                                  "edit-chord-matrix-element-indicator"
                                ]
                              : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className={editChordModalStyles["edit-chord-modal-actions"]}>
            <button
              onClick={() => {setTrigger(false); setChord(undefined)}}
              className={editChordModalStyles["edit-chord-modal-exit"]}
            >
              exit
            </button>
            <button
              onClick={() => handleSubmit()}
              className={editChordModalStyles["edit-chord-modal-submit"]}
            >
              save
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};
export default EditChordModal;
