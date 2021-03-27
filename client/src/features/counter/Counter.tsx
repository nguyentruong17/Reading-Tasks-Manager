import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from "./counterSlice";
import { selectTaskLoading, selectAllTasks, getTasks } from "../tasks/taskSlice";
import styles from "./Counter.module.css";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button
} from "@chakra-ui/react";

export function Counter() {
  const count = useSelector(selectCount);
  const isLoading = useSelector(selectTaskLoading);
  const tasks = useSelector(selectAllTasks);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");

  useEffect(() => {
    dispatch(getTasks())
  }, [])

  return (
    <>
      {isLoading ? (
        <div>
          <div className={styles.row}>
            <button
              className={styles.button}
              aria-label="Increment value"
              onClick={() => dispatch(increment())}
            >
              +
            </button>
            <span className={styles.value}>{count}</span>
            <button
              className={styles.button}
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
            >
              -
            </button>
          </div>
          <div className={styles.row}>
            <input
              className={styles.textbox}
              aria-label="Set increment amount"
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(e.target.value)}
            />
            <button
              className={styles.button}
              onClick={() =>
                dispatch(incrementByAmount(Number(incrementAmount) || 0))
              }
            >
              Add Amount
            </button>
            <button
              className={styles.asyncButton}
              onClick={() =>
                dispatch(incrementAsync(Number(incrementAmount) || 0))
              }
            >
              Add Async
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Table variant="simple">
          <TableCaption>Tasks</TableCaption>
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Title</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => {
              return (
                <Tr
                  key={task._id}
                >
                  <Td>{task.status}</Td>
                  <Td>{task.title}</Td>
                  <Td>{task.description}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        </div>
        
      )}
    </>
  );
}
