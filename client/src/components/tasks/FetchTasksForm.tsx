import React, { useState, useEffect, FC } from "react";
import { Form } from "react-final-form";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  //actions
  getTasks,

  //selectors
  selectTasksLoading,
  selectTasksPagination,
} from "features/tasks/tasksSlice";

//uis
import {
  ButtonGroup,
  Button,
  Spinner,
  FormControl,
  FormLabel,
  Tr,
  Td,
  Table,
  Tbody,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  IoMdCalendar,
  IoMdApps,
  IoMdText,
  IoMdBook,
  IoMdStats,
  IoMdClose,
  IoMdRefresh,
} from "react-icons/io";

import { Priorities, Status } from "consts";
import {
  UserTaskFilter,
  TaskStatus,
  TaskPriority,
} from "gql/generated/gql-types";

import CustomInputControl from "components/common/CustomInputControl";
import CustomSelectControl from "components/common/CustomSelectControl";
// import CustomDatePicker from "../Common/CustomDatePicker";

const STATUS_EMPTY_CASE = {
  name: "(All Staus)",
  value: "",
  color: "rgb(255, 255, 255)",
};

const PRIORITY_EMPTY_CASE = {
  name: "(All Priorities)",
  value: "",
};

interface IFields {
  fromDate: string;
  toDate: string;
  title: string;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  attachItemTitle: string;
}
const FetchTasksForm: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTasksLoading);

  const defaultFields: IFields = {
    fromDate: "",
    toDate: "",
    title: "",
    status: null,
    priority: null,
    attachItemTitle: "",
  };

  enum CheckBoxNames {
    DATE_RANGE = "Date Range",
    TITLE = "Title",
    STATUS = "Status",
    PRIORITY = "Priority",
    ATTACH_ITEM_TITLE = "Attach Item's Title",
  }

  const checkboxButtons: Array<{
    name: CheckBoxNames;
    icon: IconType;
  }> = [
    {
      name: CheckBoxNames.DATE_RANGE,
      icon: IoMdCalendar,
    },
    {
      name: CheckBoxNames.TITLE,
      icon: IoMdText,
    },
    {
      name: CheckBoxNames.STATUS,
      icon: IoMdApps,
    },
    {
      name: CheckBoxNames.PRIORITY,
      icon: IoMdStats,
    },
    {
      name: CheckBoxNames.ATTACH_ITEM_TITLE,
      icon: IoMdBook,
    },
  ];

  //   const [fields, setFields] = useState<IFields>(defaultState);
  const [checkboxSelected, setCheckboxSelected] = useState<
    Array<CheckBoxNames>
  >([]);

  useEffect(() => {
    doFetchTasks(defaultFields);
  }, []);

  //   const { fromDate, toDate, title, status, priority, attachItemTitle } = fields;

  const setSelected = (name: CheckBoxNames) => () => {
    const index = checkboxSelected.indexOf(name);
    const newCheckbox = checkboxSelected;
    if (index < 0) {
      newCheckbox.push(name);
    } else {
      newCheckbox.splice(index, 1);
    }
    setCheckboxSelected([...newCheckbox]);
  };

  const getInputErrors = () => {
    const errors = {};
    return errors;
  };

  // Set all states to default values
  const clearAll = () => {
    //setFields(defaultState);
    setCheckboxSelected([]);
  };

  const doFetchTasks = (values: IFields) => {
    const filter: UserTaskFilter = {};

    const {
      fromDate,
      toDate,
      status,
      priority,
      attachItemTitle,
      title,
    } = values;

    if (checkboxSelected.includes(CheckBoxNames.DATE_RANGE) && !!fromDate) {
      filter.from = values.fromDate;
    }

    if (checkboxSelected.includes(CheckBoxNames.DATE_RANGE) && !!toDate) {
      filter.to = toDate;
    }

    if (
      checkboxSelected.includes(CheckBoxNames.STATUS) &&
      !!status
    ) {
      filter.status = status;
    }

    if (
      checkboxSelected.includes(CheckBoxNames.PRIORITY) &&
      !!priority
    ) {
      filter.priority = priority;
    }

    if (
      checkboxSelected.includes(CheckBoxNames.ATTACH_ITEM_TITLE) &&
      !!attachItemTitle.trim()
    ) {
      filter.attachItem = {
        title: attachItemTitle.trim(),
      };
    }

    if (checkboxSelected.includes(CheckBoxNames.TITLE) && !!title.trim()) {
      filter.title = title.trim();
    }

    dispatch(getTasks({ filter }));
  };

  //   const setSpecificField = (key: string) => (
  //     value: string | TaskStatus | TaskPriority
  //   ) => {
  //     setFields({ ...fields, [key]: value });
  //   };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (values: IFields) => {
    await sleep(300);
    window.alert(JSON.stringify(values));
    doFetchTasks(values);
  };

  const inputError = getInputErrors();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={defaultFields}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Table>
            <Tbody>
              <Tr>
                <Td>
                  <FormControl>
                    <FormLabel>Custom Search Criterias</FormLabel>
                    <ButtonGroup>
                      {checkboxButtons.map((checkbox) => (
                        <Button
                          key={checkbox.name}
                          color="primary"
                          onClick={setSelected(checkbox.name)}
                          isActive={checkboxSelected.includes(checkbox.name)}
                        >
                          <checkbox.icon style={{ marginRight: 5 }} />
                          {checkbox.name}
                        </Button>
                      ))}
                      <Button color="primary" onClick={clearAll}>
                        <IoMdClose style={{ marginRight: 5 }} />
                        Clear All
                      </Button>
                    </ButtonGroup>
                  </FormControl>
                </Td>
              </Tr>
              <Tr>
                {/* {checkboxSelected.includes("Date Range") && (
          <>
            <Td md={3}>
              <CustomDatePicker
                title="From"
                value={fromDate}
                maxDate={toDate}
                placeholderText="From..."
                handleChange={setSpecificField("fromDate")}
              />
            </Td>
            <Td md={3}>
              <CustomDatePicker
                title="To"
                value={toDate}
                minDate={fromDate}
                placeholderText="To..."
                handleChange={setSpecificField("toDate")}
              />
            </Td>
          </>
        )} */}
              </Tr>
              <Tr>
                <Td>
                  {checkboxSelected.includes(CheckBoxNames.STATUS) && (
                    <>
                      <CustomSelectControl
                        name={"status"}
                        label={CheckBoxNames.STATUS}
                        options={Object.values(Status)}
                        // emptyCase={STATUS_EMPTY_CASE}
                        // handleChange={(e) => {
                        //     console.log(e.target.value)
                        // }}
                      />
                    </>
                  )}
                  {checkboxSelected.includes(CheckBoxNames.PRIORITY) && (
                    <>
                      <CustomSelectControl
                        name={"priority"}
                        label={CheckBoxNames.PRIORITY}
                        options={Object.values(Priorities)}
                        // emptyCase={PRIORITY_EMPTY_CASE}
                        // handleChange={(e) => {
                        //     console.log(e.target.value)
                        // }}
                      />
                    </>
                  )}
                </Td>
              </Tr>
              <Tr>
                {checkboxSelected.includes(CheckBoxNames.TITLE) && (
                  <>
                    <CustomInputControl
                      name={"title"}
                      label={CheckBoxNames.TITLE}
                    />
                  </>
                )}
                {checkboxSelected.includes(CheckBoxNames.ATTACH_ITEM_TITLE) && (
                  <>
                    <CustomInputControl
                      name={"attachItemTitle"}
                      label={CheckBoxNames.ATTACH_ITEM_TITLE}
                    />
                  </>
                )}
              </Tr>
              <Tr>
                <Td>
                  <Button
                    type="submit"
                    // sets to the first page to trigger fetchIncidents effect
                    color="primary"
                    isActive={Object.keys(inputError).length !== 0}
                    isLoading={loading}
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      <>
                        <IoMdRefresh style={{ marginRight: 5 }} />
                        Refresh
                      </>
                    )}
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </form>
      )}
    />
  );
};

export default FetchTasksForm;
