import axios from 'axios';
import { Dispatch } from 'redux';
import { reset } from 'redux-form';

export type CampaignActions = ILoadCampaignListAction | IUploadCampaignSuccessAction | IUploadCampaignStartAction|IUploadCampaignFailureAction;

export const LOAD_CAMPAIGNS = 'LOAD_CAMPAIGNS';
export type LOAD_CAMPAIGNS = typeof LOAD_CAMPAIGNS;
export const UPLOAD_CAMPAIGN_SUCCESS = 'UPLOAD_CAMPAIGN_SUCCESS';
export type UPLOAD_CAMPAIGN_SUCCESS = typeof UPLOAD_CAMPAIGN_SUCCESS;
export const UPLOAD_CAMPAIGN_FAILURE = 'UPLOAD_CAMPAIGN_FAILURE';
export type UPLOAD_CAMPAIGN_FAILURE = typeof UPLOAD_CAMPAIGN_FAILURE;
export const UPLOAD_CAMPAIGN_START = 'UPLOAD_CAMPAIGN_START';
export type UPLOAD_CAMPAIGN_START = typeof UPLOAD_CAMPAIGN_START;

export interface ILoadCampaignListAction {
  type: LOAD_CAMPAIGNS;
  campaigns: CapstoneICO.ICampaign[];
}
export interface IUploadCampaignSuccessAction {
  type: UPLOAD_CAMPAIGN_SUCCESS;
  // campaign: any;
}
export interface IUploadCampaignFailureAction {
  type: UPLOAD_CAMPAIGN_FAILURE;
}
export interface IUploadCampaignStartAction {
  type: UPLOAD_CAMPAIGN_START;
}


// normal action creator
export function loadCampaigns(campaigns: CapstoneICO.ICampaign[]): ILoadCampaignListAction {
  return {
    campaigns,
    type: LOAD_CAMPAIGNS,
  }
}
export function uploadCampaign(): IUploadCampaignSuccessAction {
  return {
    type: UPLOAD_CAMPAIGN_SUCCESS
  }
}
export function uploadCampaignFailure(): IUploadCampaignFailureAction{
  return {
    type: UPLOAD_CAMPAIGN_FAILURE
  }
}
export function uploadCampaignStart(): IUploadCampaignStartAction {
  return {
    type: UPLOAD_CAMPAIGN_START
  }
}

// thunk action creator
export function loadCampaignsThunk() {
  return (dispatch: Dispatch<CampaignActions>) => {
    axios.get<CapstoneICO.ICampaign[]>(`${process.env.REACT_APP_API_SERVER}/api/campaign`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        dispatch(loadCampaigns(res.data));
      });
  };
}

export function uploadCampaignThunk(campaign: any) {
  return async (dispatch: Dispatch<CampaignActions>) => {
    dispatch(uploadCampaignStart());
    const token = localStorage.getItem('token');
    const campaignToBeSent = Object.assign({},campaign);
    try {
      if(campaign.imageFile){
        const fileType = campaign.imageFile.type.replace("image/", "");
        const uploadConfig = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/upload?fileType=${fileType}`,
        { headers: { Authorization: `Bearer ${token}` } });
        // upload the file to S3 directly after
        await axios.put(uploadConfig.data.url, campaign.imageFile, {
          headers: {
              'Content-Type': campaign.imageFile.type
          }
        });
        campaignToBeSent.imageFile = uploadConfig.data.key;
      }
      
      await axios.post(`${process.env.REACT_APP_API_SERVER}/api/campaign`, campaignToBeSent, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      dispatch(uploadCampaign());
      dispatch(reset('wizard'));
    } catch (err) {
      dispatch(uploadCampaignFailure());
    }
  }
}