import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { createAd, updateAd, Ad } from "../api/ads";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";

type FormValues = {
  name: string;
  description: string;
  location: string;
  photo?: string;
  type: "Недвижимость" | "Авто" | "Услуги" | "";
  // Поля для недвижимости:
  propertyType?: string;
  area?: number;
  rooms?: number;
  price?: number;
  // Поля для авто:
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  // Поля для услуг:
  serviceType?: string;
  experience?: number;
  cost?: number;
  schedule?: string;
};

const steps = ["Основная информация", "Категорийные данные"];

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adToEdit: Ad | null = location.state?.ad || null;
  const isEditing = Boolean(adToEdit);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: adToEdit?.name || "",
      description: adToEdit?.description || "",
      location: adToEdit?.location || "",
      photo: adToEdit?.photo || "",
      type: adToEdit?.category || "",
      propertyType: adToEdit?.propertyType || "",
      area: adToEdit?.area,
      rooms: adToEdit?.rooms,
      price: adToEdit?.price,
      brand: adToEdit?.brand || "",
      model: adToEdit?.model || "",
      year: adToEdit?.year,
      mileage: adToEdit?.mileage,
      serviceType: adToEdit?.serviceType || "",
      experience: adToEdit?.experience,
      cost: adToEdit?.cost,
      schedule: adToEdit?.schedule || "",
    },
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const category = watch("type");

  const mutation = useMutation<Ad, Error, FormValues, unknown>({
    mutationFn: (data: FormValues) => {
      if (isEditing && adToEdit) {
        return updateAd(adToEdit.id, data as Partial<Ad>);
      } else {
        return createAd(data as Partial<Ad>);
      }
    },
    onSuccess: () => {
      navigate('/list');
    }
  });
  
  const isLoading = mutation.status === 'pending';

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate(data);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Простейшая валидация первого шага
  const validateStepOne = () => {
    const requiredFields: (keyof FormValues)[] = [
      "name",
      "description",
      "location",
      "type",
    ];
    for (let field of requiredFields) {
      if (!watch(field)) {
        alert(`Поле ${field} обязательно`);
        return false;
      }
    }
    return true;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Название обязательно" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Название"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{ required: "Описание обязательно" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Описание"
                  multiline
                  rows={4}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              rules={{ required: "Локация обязательна" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Локация"
                  error={Boolean(errors.location)}
                  helperText={errors.location?.message}
                />
              )}
            />
            <Controller
              name="photo"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="URL фото (необязательно)" />
              )}
            />
            <Controller
              name="type"
              control={control}
              rules={{ required: "Категория обязательна" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Категория объявления"
                  error={Boolean(errors.type)}
                  helperText={errors.type ? "Выберите категорию" : ""}
                >
                  <MenuItem value="Недвижимость">Недвижимость</MenuItem>
                  <MenuItem value="Авто">Авто</MenuItem>
                  <MenuItem value="Услуги">Услуги</MenuItem>
                </TextField>
              )}
            />
          </Box>
        );
      case 1:
        switch (category) {
          case "Недвижимость":
            return (
              <Box display="flex" flexDirection="column" gap={2}>
                <Controller
                  name="propertyType"
                  control={control}
                  rules={{ required: "Тип недвижимости обязателен" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Тип недвижимости"
                      select
                      error={Boolean(errors.propertyType)}
                      helperText={errors.propertyType?.message}
                    >
                      <MenuItem value="Квартира">Квартира</MenuItem>
                      <MenuItem value="Дом">Дом</MenuItem>
                      <MenuItem value="Коттедж">Коттедж</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name="area"
                  control={control}
                  rules={{ required: "Площадь обязательна" }}
                  render={({ field: { onChange, ...restField } }) => (
                    <TextField
                      {...restField}
                      label="Площадь (кв.м)"
                      type="number"
                      error={Boolean(errors.area)}
                      helperText={errors.area?.message}
                      onChange={(e) => onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name="rooms"
                  control={control}
                  rules={{ required: "Количество комнат обязательно" }}
                  render={({ field: { onChange, ...restField } }) => (
                    <TextField
                      {...restField}
                      label="Количество комнат"
                      type="number"
                      error={Boolean(errors.rooms)}
                      helperText={errors.rooms?.message}
                      onChange={(e) => onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name="price"
                  control={control}
                  rules={{ required: "Цена обязательна" }}
                  render={({ field: { onChange, ...restField } }) => (
                    <TextField
                      {...restField}
                      label="Цена"
                      type="number"
                      error={Boolean(errors.price)}
                      helperText={errors.price?.message}
                      onChange={(e) => onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Box>
            );
          case "Авто":
            return (
              <Box display="flex" flexDirection="column" gap={2}>
                <Controller
                  name="brand"
                  control={control}
                  rules={{ required: "Марка обязательна" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Марка"
                      select
                      error={Boolean(errors.brand)}
                      helperText={errors.brand?.message}
                    >
                      <MenuItem value="Toyota">Toyota</MenuItem>
                      <MenuItem value="BMW">BMW</MenuItem>
                      <MenuItem value="Mercedes">Mercedes</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name="model"
                  control={control}
                  rules={{ required: "Модель обязательна" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Модель"
                      error={Boolean(errors.model)}
                      helperText={errors.model?.message}
                    />
                  )}
                />
             <Controller
  name="year"
  control={control}
  rules={{ required: "Год выпуска обязателен" }}
  render={({ field: { onChange, ...restField } }) => (
    <TextField
      {...restField}
      label="Год выпуска"
      type="number"
      error={Boolean(errors.year)}
      helperText={errors.year?.message}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )}
/>

<Controller
  name="mileage"
  control={control}
  rules={{}}
  render={({ field: { onChange, ...restField } }) => (
    <TextField
      {...restField}
      label="Пробег (км)"
      type="number"
      error={Boolean(errors.mileage)}
      helperText={errors.mileage?.message}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )}
/>

              </Box>
            );
          case "Услуги":
            return (
              <Box display="flex" flexDirection="column" gap={2}>
                <Controller
                  name="serviceType"
                  control={control}
                  rules={{ required: "Тип услуги обязателен" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Тип услуги"
                      select
                      error={Boolean(errors.serviceType)}
                      helperText={errors.serviceType?.message}
                    >
                      <MenuItem value="Ремонт">Ремонт</MenuItem>
                      <MenuItem value="Уборка">Уборка</MenuItem>
                      <MenuItem value="Доставка">Доставка</MenuItem>
                    </TextField>
                  )}
                />
               <Controller
  name="experience"
  control={control}
  rules={{ required: "Опыт работы обязателен" }}
  render={({ field: { onChange, ...restField } }) => (
    <TextField
      {...restField}
      label="Опыт работы (лет)"
      type="number"
      error={Boolean(errors.experience)}
      helperText={errors.experience?.message}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )}
/>

<Controller
  name="cost"
  control={control}
  rules={{ required: "Стоимость обязательна" }}
  render={({ field: { onChange, ...restField } }) => (
    <TextField
      {...restField}
      label="Стоимость"
      type="number"
      error={Boolean(errors.cost)}
      helperText={errors.cost?.message}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )}
/>

                <Controller
                  name="schedule"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="График работы (необязательно)"
                    />
                  )}
                />
              </Box>
            );
          default:
            return (
              <Typography>Выберите категорию на предыдущем шаге</Typography>
            );
        }
      default:
        return null;
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        {isEditing ? "Редактировать объявление" : "Разместить объявление"}
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
        {renderStepContent(activeStep)}
        <Box mt={2} display="flex" justifyContent="space-between">
          {activeStep > 0 && (
            <Button variant="outlined" onClick={handleBack}>
              Назад
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                if (activeStep === 0 && validateStepOne()) {
                  handleNext();
                }
              }}
            >
              Далее
            </Button>
          ) : (
            <Button variant="contained" type="submit" disabled={isLoading}>
            {isEditing ? 'Сохранить изменения' : 'Опубликовать объявление'}
          </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FormPage;
