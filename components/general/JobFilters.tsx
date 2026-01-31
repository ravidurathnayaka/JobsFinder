"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const SALARY_MIN = 0;
const SALARY_MAX = 500_000;
const SALARY_STEP = 5_000;

function salaryRangeFromParams(
  minParam: string | null,
  maxParam: string | null
): [number, number] {
  const minVal = minParam ? Math.min(SALARY_MAX, Math.max(SALARY_MIN, Number(minParam))) : SALARY_MIN;
  const maxVal = maxParam ? Math.min(SALARY_MAX, Math.max(SALARY_MIN, Number(maxParam))) : SALARY_MAX;
  return [Math.min(minVal, maxVal), Math.max(minVal, maxVal)];
}

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraggingRef = useRef(false);

  const jobTypes = ["full-time", "part-time", "contract", "internship"];

  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const minSalaryParam = searchParams.get("minSalary");
  const maxSalaryParam = searchParams.get("maxSalary");

  const salaryRangeFromUrl = useMemo(
    () => salaryRangeFromParams(minSalaryParam, maxSalaryParam),
    [minSalaryParam, maxSalaryParam]
  );

  const [localSalaryRange, setLocalSalaryRange] = useState<[number, number]>(salaryRangeFromUrl);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalSalaryRange(salaryRangeFromUrl);
    }
  }, [salaryRangeFromUrl]);

  const createQueryString = useCallback(
    (updates: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const { name, value } of updates) {
        if (value !== "" && value != null) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const current = new Set(currentJobTypes);
    if (checked) {
      current.add(type);
    } else {
      current.delete(type);
    }

    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString([{ name: "jobTypes", value: newValue }])}`);
  };

  const handleSalaryChange = (value: number[]) => {
    isDraggingRef.current = true;
    setLocalSalaryRange(value as [number, number]);
  };

  const handleSalaryCommit = (value: number[]) => {
    isDraggingRef.current = false;
    const [min, max] = value as [number, number];
    const isFullRange = min === SALARY_MIN && max === SALARY_MAX;
    router.push(
      `?${createQueryString([
        { name: "minSalary", value: isFullRange ? "" : String(min) },
        { name: "maxSalary", value: isFullRange ? "" : String(max) },
      ])}`
    );
  };

  const clearFilters = () => {
    router.push("/");
  };

  return (
    <Card className="col-span-1 h-fit">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Filter</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={clearFilters}
          >
            <span className="mr-2">Clear all</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type.toLowerCase()}
                  checked={currentJobTypes.includes(type)}
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(type, checked as boolean)
                  }
                />
                <Label
                  htmlFor={type.toLowerCase()}
                  className="text-sm font-medium"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Salary Range</Label>
          <Slider
            min={SALARY_MIN}
            max={SALARY_MAX}
            step={SALARY_STEP}
            value={localSalaryRange}
            onValueChange={handleSalaryChange}
            onValueCommit={handleSalaryCommit}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(localSalaryRange[0])}</span>
            <span>{formatCurrency(localSalaryRange[1])}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
