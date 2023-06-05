import AddNewStuff from '../common/AddNewStuffFrom'
import { Button, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy'
import { ImageIcon } from 'lucide-react'
import React from 'react'

type AddingModalProps = {
  open: boolean
  onClose: () => void
  layout?: 'center' | 'fullscreen'
}

function AddingModal({ open = false, onClose, layout = 'center' }: AddingModalProps) {
  return (
    <Modal
      open={!!open}
      onClose={() => onClose()}
    >
      <ModalDialog
        className="!min-w-[600px]"
        aria-labelledby="layout-modal-title"
        aria-describedby="layout-modal-description"
        layout={layout}
      >
        <ModalClose />
        <AddNewStuff
          onFinished={() => {
            setTimeout(onClose, 500)
          }}
        />
      </ModalDialog>
    </Modal>
  )
}

export default AddingModal
