import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Exercise from '../model/Exercise';
import { useEffect } from 'react';

export function DeleteDialog({deleteDialogOpen, setDeleteDialogOpen, selectedRow, backendUrl, deleteUrl, setExercises} : 
    {deleteDialogOpen: boolean, setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, 
        selectedRow: number, backendUrl: string, deleteUrl: string, setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>}) {
            
    function handleClose() {
        setDeleteDialogOpen(false);
    }

    async function  handleConfirmedDelete() {
        await fetch(`${deleteUrl}/${selectedRow}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'}
        })
        .catch(error => console.error("Error fetching delete", error));

        await fetch(backendUrl, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            setExercises(data);
        })
        .catch(error => console.error("Error fetching delete", error))
        setDeleteDialogOpen(false);
    }

    useEffect(() => {
        handleConfirmedDelete();
    }, []);

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