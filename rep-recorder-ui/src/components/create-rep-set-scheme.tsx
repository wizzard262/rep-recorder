import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import useCreateRepSetScheme from "~/hooks/useCreateRepSetScheme";
import type { CreateRepSetSchemeRequest } from "~/types/rep-set-scheme-types";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { MenuItem, Select } from "@mui/material";

type MovementOption = {
  name: string;
  type: string;
  isCompound: boolean;
};

const movements: Record<string, MovementOption> = {
  bench: { name: "Bench Press", type: "PUSH", isCompound: true },
  overhead: { name: "Overhead Press", type: "PUSH", isCompound: true },
  incline: { name: "Incline Bench Press", type: "PUSH", isCompound: true },
  ezext: { name: "Ez Extension", type: "PUSH", isCompound: false },

  bentrow: { name: "Bent Row", type: "PULL", isCompound: true },
  shrug: { name: "Deadlift Shrug", type: "PULL", isCompound: true },
  upright: { name: "Upright Row", type: "PULL", isCompound: true },
  ezcurl: { name: "Ez Curl", type: "PULL", isCompound: false },

  squat: { name: "Squat", type: "LEGS", isCompound: true },
  legext: { name: "Leg Extension", type: "LEGS", isCompound: false },
  legcurl: { name: "Leg Curl", type: "LEGS", isCompound: false },
  calfraisecurl: { name: "Calf Raise", type: "LEGS", isCompound: false },

  wrist: { name: "Wrist Curl", type: "OTHER", isCompound: false },
  revwrist: { name: "Reverse Wrist Curl", type: "OTHER", isCompound: false }
};

const validationSchema = yup.object({
  date: yup.mixed().required("Date is required"),
  kilogramMass: yup.number().required().positive(),
  repetitions: yup.number().required().positive().integer(),
  exerciseMovement: yup
  .string()
  .oneOf(Object.keys(movements))
  .required("Exercise movement is required")
});

export default function CreateRepSetSchemeForm() {
  const [success, setSuccess] = useState(false);
  const { createRepSetSchemeAsync, isSubmitting } = useCreateRepSetScheme();

  const form = useFormik({
    initialValues: {
      date: dayjs(),
      exerciseMovement: "Bench Press",
      kilogramMass: 0,
      repetitions: 0
    },
    validationSchema,
    onSubmit: async (values) => {
      const request: CreateRepSetSchemeRequest = {
        kilogramMass: Number(values.kilogramMass),
        repetitions: Number(values.repetitions),
        date: values.date.toISOString(),
        exerciseMovement: movements[values.exerciseMovement]
      };

      await createRepSetSchemeAsync(request);
      setSuccess(true);
      form.resetForm();
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <section id="add-firm">
        <h2 style={{ textAlign: "left" }}>Add Rep Set Schemes</h2>

        <DatePicker
          label="Date"
          value={form.values.date}
          onChange={(newValue) => form.setFieldValue("date", newValue)}
          disabled={isSubmitting}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              id: "date",
              name: "date",
              error: Boolean(form.touched.date && form.errors.date),
              disabled: isSubmitting,
              sx: { marginBottom: 2 }
            }
          }}
        />

        <Select
          fullWidth
          id="exerciseMovement"
          name="exerciseMovement"
          value={form.values.exerciseMovement}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.exerciseMovement && Boolean(form.errors.exerciseMovement)}
          disabled={isSubmitting}
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="bench">PUSH - Bench Press</MenuItem>
          <MenuItem value="overhead">PUSH - Overhead Press</MenuItem>
          <MenuItem value="incline">PUSH - Incline Bench Press</MenuItem>
          <MenuItem value="ezext">PUSH - Ez Extension</MenuItem>

          <MenuItem value="bentrow">PULL - Bent Row</MenuItem>
          <MenuItem value="shrug">PULL - Deadlift Shrug</MenuItem>
          <MenuItem value="upright">PULL - Upright Row</MenuItem>
          <MenuItem value="ezcurl">PULL - Ez Curl</MenuItem>

          <MenuItem value="squat">LEGS - Squat</MenuItem>
          <MenuItem value="legext">LEGS - Leg Extension</MenuItem>
          <MenuItem value="legcurl">LEGS - Leg Curl</MenuItem>
          <MenuItem value="calfraisecurl">LEGS - Calf Raise</MenuItem>

          <MenuItem value="wrist">OTHER - Wrist Curl</MenuItem>
          <MenuItem value="revwrist">OTHER - Reverse Wrist Curl</MenuItem>
        </Select>

        <TextField
          fullWidth
          id="kilogramMass"
          name="kilogramMass"
          label="Kilogram Mass"
          type="number"
          value={form.values.kilogramMass}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.kilogramMass && Boolean(form.errors.kilogramMass)}
          helperText="Enter the mass in kilograms (Kg)"
          disabled={isSubmitting}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          fullWidth
          id="repetitions"
          name="repetitions"
          label="Repetitions"
          type="number"
          value={form.values.repetitions}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.repetitions && Boolean(form.errors.repetitions)}
          helperText="Enter the number of repetitions (Integer)"
          disabled={isSubmitting}
          sx={{ marginBottom: 2 }}
        />

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          onClick={() => form.submitForm()}
          disabled={isSubmitting}
          sx={{ marginBottom: 2 }}
        >
          Create Rep Set Scheme
        </Button>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Rep Set Scheme created successfully!
          </Alert>
        )}

      </section>
    </LocalizationProvider>
  );
}
