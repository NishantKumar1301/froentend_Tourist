import React, { useReducer, useEffect } from 'react'

import './Input.css'

import { validate } from '../../shared/util/validators'

function inputReducer(state, action) {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      }
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      }
    }
    default:
      return state
  }
}

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '' ,
    isValid: false,
    isTouched: props.initialValid || false,
  })

  const {id, onInput} = props;
  const {value,isValid} = inputState

  useEffect(() => {
    onInput(id, value,isValid)
  }, [id,onInput,value,isValid])

  function changeHandler(event) {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    })
  }

  function touchHandler() {
    dispatch({
      type: 'TOUCH',
    })
  }

  let element = ''

  if (props.element === 'input') {
    element = (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    )
  } else {
    element = (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    )
  }

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label} </label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  )
}

export default Input
