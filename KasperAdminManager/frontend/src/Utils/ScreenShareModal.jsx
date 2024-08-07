import React, { useState, useEffect, useRef } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdScreenShare, MdClose } from "react-icons/md";
import { useTheme } from "../Context/TheamContext/ThemeContext";

const ScreenShareModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const screenRef = useRef(null);
  const { darkMode } = useTheme();

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing screen:", error);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
  };

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };

  useEffect(() => {
    if (showModal) {
      startScreenShare();
    } else {
      stopScreenShare();
    }
  }, [showModal]);

  useEffect(() => {
    return () => {
      stopScreenShare(); // Cleanup on unmount
    };
  }, []);

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip
            style={{ overflow: "hidden" }}
            className="border border-2 p-0 rounded-5 "
            id="button-tooltip"
          >
            Share Screen
          </Tooltip>
        }
      >
        <button
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}
          onClick={toggleModal}
          className="btn p-0 d-flex my-auto"
        >
          <MdScreenShare />
        </button>
      </OverlayTrigger>

      <Modal show={showModal} onHide={toggleModal} size="xl" centered>
        <Modal.Body className="p-0">
          <div className="modal-content">
            {screenStream ? (
              <video
                ref={screenRef}
                className="screen-share-video"
                autoPlay
                playsInline
              />
            ) : (
              <div className="text-center">Loading screen share...</div>
            )}
            <button className="btn btn-danger close-btn" onClick={toggleModal}>
              <MdClose />
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <style jsx>{`
        .modal-content {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .screen-share-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 100;
        }
      `}</style>
    </>
  );
};

export default ScreenShareModal;
