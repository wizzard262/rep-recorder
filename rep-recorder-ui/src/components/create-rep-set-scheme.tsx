import { MenuItem } from "@mui/material";
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

const validationSchema = yup.object({
  date: yup.mixed().required("Date is required"),
  exerciseMovement: yup.string().trim().required().min(1).max(100),
  kilogramMass: yup.number().required().positive(),
  repetitions: yup.number().required().positive().integer()
});

export default function CreateRepSetSchemeForm() {
  const [success, setSuccess] = useState(false);
  const { createRepSetSchemeAsync, isSubmitting } = useCreateRepSetScheme();

  const form = useFormik({
    initialValues: {
      date: dayjs(),
      exerciseMovement: "BenchPress",
      kilogramMass: 0,
      repetitions: 0
    },
    validationSchema,
    onSubmit: async (values) => {
      const request: CreateRepSetSchemeRequest = {
        ...values,
        date: values.date.toISOString(),
        exerciseMovement: {
          name: values.exerciseMovement,
          type: "Push",
          isCompound: false
        }
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

        <TextField
          fullWidth
          select
          id="exerciseMovement"
          name="exerciseMovement"
          label="Exercise Movement"
          value={form.values.exerciseMovement}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.exerciseMovement && Boolean(form.errors.exerciseMovement)}
          disabled={isSubmitting}
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="Bench Press">PUSH - Bench Press</MenuItem>
          <MenuItem value="Overhead Press">PUSH - Overhead Press</MenuItem>
          <MenuItem value="Incline Bench Press">PUSH - Incline Bench Press</MenuItem>
          <MenuItem value="Ez Extension">PUSH - Ez Extension</MenuItem>

          <MenuItem value="Bent Row">PULL - Bent Row</MenuItem>
          <MenuItem value="Deadlift Shrug">PULL - Deadlift Shrug</MenuItem>
          <MenuItem value="Upright Row">PULL - Upright Row</MenuItem>
          <MenuItem value="Ez Curl">PULL - Ez Curl</MenuItem>

          <MenuItem value="Squat">LEGS - Squat</MenuItem>
          <MenuItem value="Leg Extension">LEGS - Leg Extension</MenuItem>
          <MenuItem value="Leg Curl">LEGS - Leg Curl</MenuItem>

          <MenuItem value="Wrist Curl">OTHER - Wrist Curl</MenuItem>
          <MenuItem value="Reverse Wrist Curl">OTHER - Reverse Wrist Curl</MenuItem>
        </TextField>

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
