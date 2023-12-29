import React, { useState, useContext } from 'react'

import './PlaceItem.css'

import Button from '../../shared/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

function PlaceItem(props) {
  const { isLoading,  sendRequest, clearError } = useHttpClient()

  const auth = useContext(AuthContext)

  const [showMap, setShowMap] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  function openMapHandler() {
    setShowMap(true)
  }

  function closeMapHandler() {
    setShowMap(false)
  }

  function showDeleteWarningHandler() {
    setShowConfirmModal(true)
  }

  function cancelDeleteHandler() {
    setShowConfirmModal(false)
  }

  async function confirmDeleteHandler() {
    setShowConfirmModal(false)

     try {
       await sendRequest(
         `http://localhost:5000/api/places/${props.id}`,
         'DELETE',
         null,
         {
           Authorization: 'Bearer ' + auth.token,
         }
       )
       props.onDelete(props.id)
     } catch (err) {}
  }

  return (
    <>
      <ErrorModal  onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={18} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place ? Please note that it can
          not be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address} </h3>
            <p>{props.description} </p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
