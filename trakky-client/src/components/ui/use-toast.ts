// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"
import { demoMode } from "@/constants.ts";
import { UseFormReturn } from "react-hook-form";

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 200000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}


function successFailToast(
  {
    success,
    successMessage,
    errorMessage
  }: {
    success: boolean,
    successMessage: string;
    errorMessage: string;
  }) {
  if (demoMode) {
    toast({
      title: "Data cannot be modified in demo mode!",
      variant: "warning"
    })
  } else if (success) {
    toast({
      title: `${successMessage}`,
      className: "bg-green-600",
    })
  } else {
    toast({
      title: `${errorMessage}`,
      className: "bg-red-600",
    })
  }
}

function valueExistsToast(existingValues: string[], value: string): boolean {
  const exists = existingValues.some((v) => v.toLowerCase() == value.toLowerCase());

  if(exists) {
    toast({
      title: `"${value}" already exists!`,
      variant: "warning"
    })
    return true;
  } else {
    return false;
  }
}

function formToast(
  {
    success,
    form,
    refresh,
    setIsSuccess,
    setIsError,
    successMessage,
    errorMessage,
    editValues,
    fieldsToReset,
    focusOn
  }: {
    success: boolean,
    form:  UseFormReturn<any>,
    refresh: (flushBeforeRefresh: boolean) => void;
    setIsSuccess: (isSuccess: boolean) => void;
    setIsError: (isError: boolean) => void;
    successMessage: string;
    errorMessage: string;
    editValues?: any;
    fieldsToReset: string[];
    focusOn?: string;
  }) {

  if (demoMode) {
    toast({
      title: "Data cannot be modified in demo mode!",
      variant: "warning"
    })
  } else if (success) {
    setIsSuccess(true);
    if (editValues === undefined) {
      fieldsToReset.forEach((field) => {
        form.resetField(field);
      });

      if(focusOn !== undefined) {
        form.setFocus(focusOn);
      }

      toast({
        // title: "Added!",
        title: `${successMessage}`,
        className: "bg-green-600",
      })
    }
    setTimeout(() => {
      refresh(false);
      setIsSuccess(false);
    }, 1000);
  } else {
    toast({
      // title: "Error: could not save!",
      title: `${errorMessage}`,
      className: "bg-red-600",
    })
    setIsError(true);
  }
}



export { useToast, toast, formToast, successFailToast, valueExistsToast }
