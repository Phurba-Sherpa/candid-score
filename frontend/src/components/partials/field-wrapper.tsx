import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type FieldType = 'textarea' | 'select' | 'text' | 'email' | 'password'

interface SelectOption {
  value: string | number
  label: string
}

interface RadioOption {
  value: string
  label: string
  desc?: string
  points?: number
}

export interface FormField {
  label?: string
  name: string
  type: FieldType
  placeholder?: string
  options?: SelectOption[]
  required?: boolean
  radioOptions?: RadioOption[]
}

interface FieldProps<TFieldValues extends FieldValues> {
  type: FieldType
  label?: string
  name: Path<TFieldValues>
  options?: SelectOption[]
  radioOptions?: RadioOption[]
  placeholder?: string
  required?: boolean
}

const FieldWrapper = <TFieldValues extends FieldValues>({
  type,
  label,
  name,
  options,
  required = true,
  placeholder,
}: FieldProps<TFieldValues>) => {
  const {
    control,
    formState,
    getFieldState,
  } = useFormContext<TFieldValues>()

  const fieldError = getFieldState(name, formState).error
  const errorMessage = typeof fieldError?.message === 'string' ? fieldError.message : undefined

  return (
    <Field data-invalid={Boolean(errorMessage)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case 'textarea':
              return (
                <Textarea
                  {...field}
                  required={required}
                  className="bg-background"
                  aria-invalid={Boolean(errorMessage)}
                  id={name}
                  name={name}
                  placeholder={placeholder}
                  value={typeof field.value === 'string' ? field.value : ''}
                />
              )
            case 'select':
              return (
                <Select
                  name={field.name}
                  value={typeof field.value === 'string' ? field.value : ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className="w-full bg-background"
                    aria-invalid={Boolean(errorMessage)}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{label}</SelectLabel>
                      {(options ?? []).map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )
            case 'text':
            case 'email':
            case 'password':
            default:
              return (
                <Input
                  {...field}
                  required={required}
                  className="bg-background"
                  aria-invalid={Boolean(errorMessage)}
                  id={name}
                  name={name}
                  type={type === 'email' ? 'email' : type === 'password' ? 'password' : 'text'}
                  placeholder={placeholder}
                  value={typeof field.value === 'string' ? field.value : ''}
                />
              )
          }
        }}
      />
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </Field>
  )
}

export default FieldWrapper
