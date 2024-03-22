import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function DeleteDialog({deleteDialogOpen, setDeleteDialogOpen, selectedRow, exercises, setExercises, setTable, getExercises}) {
    function handleClose() {
        setDeleteDialogOpen(false);
    }

    function handleConfirmedDelete() {
        exercises = exercises.filter((exercise) => exercise.id != selectedRow);
        setExercises(exercises);
        setTable(getExercises(exercises));
        setDeleteDialogOpen(false);
    }
    return (
        <div>
            <Dialog open={deleteDialogOpen} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                    {"Confirm delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>Cancel</button>
                    <button onClick={handleConfirmedDelete} autoFocus>Yes</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}