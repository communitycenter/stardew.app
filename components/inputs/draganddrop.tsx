import React from 'react'

export interface DragAndDropProps {
  onDragStateChange?: (isDragActive: boolean) => void
  onDrag?: () => void
  onDragIn?: () => void
  onDragOut?: () => void
  onDrop?: () => void
  onFilesDrop?: (files: File[]) => void
}

export const DragAndDrop = React.memo(
  (props: React.PropsWithChildren<DragAndDropProps>) => {
    const {
      onDragStateChange,
      onFilesDrop,
      onDrag,
      onDragIn,
      onDragOut,
      onDrop,
    } = props

    const [isDragActive, setIsDragActive] = React.useState(false)
    const dragAndDropRef = React.useRef<null | HTMLDivElement>(null)

    const mapFileListToArray = (files: FileList) => {
      const array = []

      for (let i = 0; i < files.length; i++) {
        array.push(files.item(i))
      }

      return array
    }

    const handleDragIn = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()
        onDragIn?.()

        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
          setIsDragActive(true)
        }
      },
      [onDragIn]
    )

    const handleDragOut = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()
        onDragOut?.()

        setIsDragActive(false)
      },
      [onDragOut]
    )

    const handleDrag = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()

        onDrag?.()
        if (!isDragActive) {
          setIsDragActive(true)
        }
      },
      [isDragActive, onDrag]
    )

    const handleDrop = React.useCallback(
      (event) => {
        event.preventDefault()
        event.stopPropagation()

        setIsDragActive(false)
        onDrop?.()

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const files = mapFileListToArray(event.dataTransfer.files)

          onFilesDrop?.(files)
          event.dataTransfer.clearData()
          console.log({files})
        }
      },
      [onDrop, onFilesDrop]
    )

    React.useEffect(() => {
      onDragStateChange?.(isDragActive)
    }, [isDragActive])

    React.useEffect(() => {
      const tempZoneRef = dragAndDropRef?.current
      if (tempZoneRef) {
        tempZoneRef.addEventListener('dragenter', handleDragIn)
        tempZoneRef.addEventListener('dragleave', handleDragOut)
        tempZoneRef.addEventListener('dragover', handleDrag)
        tempZoneRef.addEventListener('drop', handleDrop)
      }

      return () => {
        tempZoneRef?.removeEventListener('dragenter', handleDragIn)
        tempZoneRef?.removeEventListener('dragleave', handleDragOut)
        tempZoneRef?.removeEventListener('dragover', handleDrag)
        tempZoneRef?.removeEventListener('drop', handleDrop)
      }
    }, [])

    return <div ref={dragAndDropRef}>{props.children}</div>
  }
)

DragAndDrop.displayName = 'DragAndDrop'

export default DragAndDrop;