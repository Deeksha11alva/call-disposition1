import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, withTaskContext } from '@twilio/flex-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const DefaultDisposition = 'DEFAULT';

class DispositionDialog extends React.Component {
  state = {
    callDisposition: DefaultDisposition,
    options: ['Inquiry', 'Request', 'Complaint', 'CallOut', 'Others']
  }

  handleClose = () => {
    this.closeDialog();
  }

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'DispositionDialog',
      state: { isOpen: false }
    });
  }


  handleChange = e => {
    const value = e.target.value;
    this.setState({ callDisposition: value });
  }



  handleSaveDisposition = async () => {
    //save disposition
    console.log('Saving call disposition');
    console.log('task: ', this.props.task);
    let dispValue = this.state.callDisposition
    if (dispValue != DefaultDisposition) {
      let newAttributes = { ...this.props.task.attributes };
      newAttributes.disposition = dispValue;
      //insights outcome
      let conversations = this.props.task.attributes.conversations;
      let newConv = {};
      if (conversations) {
        newConv = { ...conversations };
      }
      newConv.outcome = dispValue;
      newAttributes.conversations = newConv;

      await this.props.task.setAttributes(newAttributes);
      //clear disposition
      this.setState({ callDisposition: DefaultDisposition });
      this.closeDialog();
    }

  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen || false}
        onClose={this.handleClose}
      >
        <DialogContent>
          <DialogContentText>
            Please select the disposition value for the completed call.
          </DialogContentText>
          <Select
            value={this.state.callDisposition}
            onChange={this.handleChange}
            name="disposition"
          >
            <MenuItem value={DefaultDisposition}>SELECT DISPOSITION</MenuItem>
            {/* {this.state.options.map((option) => (
              <MenuItem
                key={option}
                value={option}
              > {option}
              </MenuItem>
            ))} */}
           
 <MenuItem value="Inquiry" >Inquiry</MenuItem>
            <MenuItem  value="Request">Request</MenuItem>
            <MenuItem  value="Complaint">Complaint</MenuItem>
            <MenuItem value="Call Out" >Call Out</MenuItem>
            <MenuItem value="Others" >Others</MenuItem>


          </Select>
        </DialogContent>



        <DialogActions>
          <Button
            onClick={this.handleSaveDisposition}
            color="primary"
          >
            Save
          </Button>

        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dispositionDialogState = componentViewStates && componentViewStates.DispositionDialog;
  const isOpen = dispositionDialogState && dispositionDialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(withTaskContext(DispositionDialog)));