import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { PDFDocument, PDFText, PDFTable, PDFTableRow, PDFTableColumn, PDFColumns, PDFColumn } from 'react-pdfmake';
import { useNavigate, useParams } from 'react-router';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import DashboardLayout from '../../../layouts/dashboard/DashboardLayout';
import Back from '../../../assets/images/arrow_left.svg';
import ReliabuildInvoiceTemp from '../../../assets/images/ReliabuildInvoiceTemp.png';
import Invoice from '../../../assets/icons/Invoice.svg';
import DashboardHeader from '../../../layouts/dashboard/DashboardHeader';
import {
  Button,
  GeneralInput,
  HeadCard,
  InputLabel,
  MemoDetailsParagraph,
  MemoDetailsSpan,
  Wrapper,
} from '../../../styles/main';
import { capitalize } from '../../../utils/formatNumber';
import { updateMemo } from '../../../redux/actions/MemoAction';
import SuccessCard from '../../../components/SuccessCard';
import ErrorCard from '../../../components/ErrorCard';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function MemoDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [data, setData] = useState({
    action: '',
    remarks: '',
  });

  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const { allMemo, loading } = useSelector((state) => state.memo);
  const { user } = useSelector((state) => state.auth);

  console.log(allMemo);

  const { staffs } = useSelector((state) => state.staff);

  console.log(staffs);

  const getName = (id) => {
    const filterStaff = staffs?.filter((staff) => staff?._id === id);

    console.log(id);

    console.log(filterStaff);

    return (
      <p>
        {capitalize(filterStaff[0]?.firstName)} {capitalize(filterStaff[0]?.lastName)}
      </p>
    );
  };

  console.log(params);

  const memo = allMemo?.filter((item) => item?._id === params?.id);

  console.log(memo);

  const handleFormChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [recipient, setRecipient] = useState({
    recipientId: memo[0]?.recipient?.[0]?.recipientId,
    action: '',
    status: '',
    remarks: '',
    _id: memo[0]?.recipient?.[0]?._id,
  });

  const memoCopies = memo[0]?.copies?.map((copy) => ({
    action:
      user?.user?.staffId === copy.recipientId || user?.user?.staffId === memo[0]?.recipient[0]?.recipientId
        ? data?.action
        : 'None',
    recipientId: copy.recipientId,
    status: 'true',
    remarks:
      user?.user?.staffId === copy.recipientId || user?.user?.staffId === memo[0]?.recipient[0]?.recipientId
        ? data?.remarks
        : '',
    _id: copy?._id,
  }));

  console.log(memoCopies);

  const handleMemoAction = (e) => {
    e.preventDefault();
    const selected = {
      _id: params?.id,
      copies: memoCopies,
      memoTitle: memo[0]?.memoTitle,
      memoBody: memo[0]?.memoBody,
      ownerId: memo[0]?.ownerId,
      recipient,
    };
    console.log(selected);
    dispatch(updateMemo(selected, setOpen, setError, setErrorMessage, setSuccessMessage));
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
  };

  const handleClick = () => {
    handleClose();
  };
  return (
    <>
      <SuccessCard
        open={open}
        handleClose={handleClose}
        message={successMessage}
        btnText={'Continue'}
        handleClick={handleClick}
      />
      <ErrorCard
        open={error}
        handleClose={handleClose}
        message={errorMessage}
        btnText={'Continue'}
        handleClick={handleClick}
      />
      <Helmet>Client Invoice Details | Relia Energy</Helmet>
      <Wrapper>
        <DashboardHeader title={'Client Invoice Details'} text={'View client???s invoice details'} icon={Invoice} />
        <Stack>
          <Typography
            sx={{ color: 'primary.main', cursor: 'pointer', display: 'flex', mt: '42px', mb: '32px' }}
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src={Back} alt="back" style={{ marginRight: '0.5rem' }} />
            Back
          </Typography>
        </Stack>
        <HeadCard
          sx={{
            justifyContent: 'flex-start',
            gap: '170px',
          }}
        >
          <Stack spacing={2}>
            {/* <Box
          style={{
            margin: '24px 0px 0px 0px',
            width: '100%',
          }}
        >
          <Document
            file={pdfToView}
            onLoadSuccess={onDocumentLoadSuccess}
            onSourceError={() => {
              console.log('error retrieving document');
            }}
            error={() => {
              return 'Failed to load PDF file.';
            }}
          >
            <Page pageNumber={numPages} scale={scale} />
          </Document>
        </Box> */}
            <Stack spacing={6} sx={{ mb: '50px' }}>
              <Typography variant="h4">{memo[0]?.memoType}</Typography>
              <Stack spacing={4} sx={{ gap: '30px' }}>
                <MemoDetailsParagraph variant="h5">
                  Date: <MemoDetailsSpan>{moment(memo[0]?.createdAt).format('L')}</MemoDetailsSpan>
                </MemoDetailsParagraph>
                <MemoDetailsParagraph variant="h5">
                  From: <MemoDetailsSpan> {getName(memo[0]?.ownerId)}</MemoDetailsSpan>
                </MemoDetailsParagraph>
                <MemoDetailsParagraph variant="h5">
                  To: <MemoDetailsSpan> {getName(memo[0]?.recipient[0]?.recipientId)}</MemoDetailsSpan>
                </MemoDetailsParagraph>

                <Stack sx={{ marginTop: '0px !important' }}>
                  {React.Children.toArray(
                    memo[0]?.copies?.map((copy, index) => (
                      <Stack direction={'row'} alignItems="center">
                        <MemoDetailsParagraph>{`CC${index + 1}:`} </MemoDetailsParagraph>
                        <MemoDetailsSpan>{getName(copy?.recipientId)}</MemoDetailsSpan>
                      </Stack>
                    ))
                  )}
                </Stack>

                <MemoDetailsParagraph>
                  Attachment:
                  <MemoDetailsSpan>{memo[0]?.attachment === '' ? 'No' : 'Yes'}</MemoDetailsSpan>
                </MemoDetailsParagraph>
                <MemoDetailsParagraph>
                  Memo Message:
                  <MemoDetailsSpan>{memo[0]?.memoBody}</MemoDetailsSpan>
                </MemoDetailsParagraph>
              </Stack>
            </Stack>
            {/* <img
              src={memo[0]?.attachment}
              alt="invoice"
              style={{
                margin: '24px 0px 0px 0px',
              }}
            /> */}
            <Grid
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                overflowX: 'hidden',
                margin: '3rem 1rem',
              }}
            >
              <Document
                className="custom-class-name-2"
                file={memo[0]?.attachment}
                onLoadSuccess={onDocumentLoadSuccess}
                // loading
              >
                {numPages &&
                  React.Children.toArray(
                    [...new Array(numPages)].map((page, index) => (
                      <>
                        <Page
                          canvasBackground="#f9f9f9"
                          className="custom-class-name-1 "
                          pageNumber={index + 1}
                          scale={scale}
                        />
                        <p style={{ fontSize: '12px', textAlign: 'center' }}>
                          Page {index + 1} of {numPages}
                        </p>
                      </>
                    ))
                  )}
              </Document>
            </Grid>
            <Stack direction={'row'} sx={{ mt: '3rem' }} alignItems="center" spacing={4} width="100%">
              <Typography
                variant="h5"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '16px !important',
                  lineHeight: '22px',
                  color: '#272525',
                }}
              >
                Action:{' '}
                <span
                  style={{
                    marginLeft: '10px',
                    fontWeight: '400',
                    fontSize: '14px !important',
                    lineHeight: '22px',
                    color: '#272525',
                  }}
                >
                  Recommended for approval
                </span>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '16px !important',
                  lineHeight: '22px',
                  color: '#272525',
                }}
              >
                By:{' '}
                <span
                  style={{
                    marginLeft: '10px',
                    fontWeight: '400',
                    fontSize: '14px !important',
                    lineHeight: '22px',
                    color: '#272525',
                  }}
                >
                  Fatimah Mohammed
                </span>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '16px !important',
                  lineHeight: '22px',
                  color: '#272525',
                }}
              >
                Signature:{' '}
                <span
                  style={{
                    marginLeft: '10px',
                    fontWeight: '400',
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: '#272525',
                  }}
                />
              </Typography>
            </Stack>
            <Grid container sx={{ mt: 4 }} component="form" onSubmit={handleMemoAction}>
              <Grid item xs={12} md={4}>
                <Stack>
                  <InputLabel id="action">Action</InputLabel>
                  <GeneralInput
                    select
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                    value={data?.action}
                    name="action"
                    onChange={(e) => handleFormChange(e.target)}
                  >
                    <option value="">Select action</option>
                    <option value="approve">Approve</option>
                    <option value="comment">Comment</option>
                    <option value="reject">Reject</option>
                  </GeneralInput>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack>
                  <InputLabel id="date">Remarks</InputLabel>
                  <GeneralInput
                    variant="outlined"
                    fullWidth
                    placeholder="Enter remark"
                    value={data?.remarks}
                    name="remarks"
                    onChange={(e) => handleFormChange(e.target)}
                  />
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button type="submit" sx={{ width: '100%', height: '55px' }}>
                  {loading ? 'Please wait...' : ' Submit'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </HeadCard>
      </Wrapper>
    </>
  );
}

export default MemoDetails;
