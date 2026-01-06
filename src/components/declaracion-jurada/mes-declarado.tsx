"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const years = Array.from({ length: 10 }, (_, i) => 2025 - i); // últimos 10 años

export default function MonthYearCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Card className="w-full max-w-xl mx-auto p-4 rounded-lg border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Mes y Año Declarado
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 mt-2">
        {/* Select Mes */}
        <div className="flex-1">
          <Controller
            name="mesDeclarado"
            control={control}
            defaultValue=""
            rules={{ required: "Debe seleccionar un mes" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mesDeclarado && (
            <span className="text-red-500 text-sm mt-1">
              {errors.mesDeclarado.message as string}
            </span>
          )}
        </div>

        {/* Select Año */}
        <div className="flex-1">
          <Controller
            name="anioDeclarado"
            control={control}
            defaultValue=""
            rules={{ required: "Debe seleccionar un año" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.anioDeclarado && (
            <span className="text-red-500 text-sm mt-1">
              {errors.anioDeclarado.message as string}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
