import React, { ReactNode } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components/macro';

type BuildFormPayloadType<TMutationPayload> = (formValues: {
  [x: string]: any;
}) => TMutationPayload;

type MutationFnType<TMutationPayload extends Record<string, any>> = (
  payload: TMutationPayload
) => Promise<Record<string, any>>;

type RenderPropsType<TMutationPayload extends Record<string, any>> = {
  mutate: (payload: TMutationPayload) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
};

interface Props<TMutationPayload> {
  children: ({
    mutate,
    isLoading,
    isError,
    isSuccess,
    isIdle,
  }: RenderPropsType<TMutationPayload>) => ReactNode;
  buildFormPayload: BuildFormPayloadType<TMutationPayload>;
  mutationFn: MutationFnType<TMutationPayload>;
  onSuccess?: (data: Record<string, any>) => void;
  onError?: () => void;
  invalidateQueries?: Array<string | Array<string>>;
}

// TODO: Refactor useMutation call out from Form component for simpler use

const Form = <TMutationPayload,>({
  children,
  ...props
}: Props<TMutationPayload>) => {
  const methods = useForm({ shouldUnregister: true });
  return (
    <FormProvider {...methods}>
      <FormContent methods={methods} {...props}>
        {children}
      </FormContent>
    </FormProvider>
  );
};

type FormContentProps<TMutationPayload extends Record<string, any>> =
  Props<TMutationPayload> & {
    methods: UseFormReturn;
  };

const FormContent = <TMutationPayload,>({
  buildFormPayload,
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries,
  methods,
  children,
}: FormContentProps<TMutationPayload>) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isSuccess, isIdle } = useMutation<
    Record<string, any>,
    unknown,
    TMutationPayload,
    unknown
  >(payload => mutationFn(payload), {
    onSuccess: data => {
      if (invalidateQueries && invalidateQueries.length) {
        invalidateQueries.forEach(queryKey =>
          queryClient.invalidateQueries(queryKey)
        );
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });

  const handleSubmit = methods.handleSubmit(formValues => {
    const payload = buildFormPayload(formValues);
    mutate(payload);
  });

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        {children({
          mutate,
          isLoading,
          isError,
          isSuccess,
          isIdle,
        })}
      </StyledForm>
    </>
  );
};

export default Form;

/* Styled Components */

const StyledForm = styled.form`
  margin-top: 2em;
`;
