import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography, Fab } from '@material-ui/core';
import { ChevronRight, ChevronLeft } from '@material-ui/icons';
import { pdfjs, Document, Page } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		pageNumbers: {
			color: theme.palette.info.contrastText,
			position: 'fixed',
			top: theme.spacing(2),
			right: theme.spacing(2),
		},
		next: {
			position: 'fixed',
			top: '50%',
			right: '20%',
		},
		previous: {
			position: 'fixed',
			top: '50%',
			left: '20%',
		},
	})
);

interface Props {
	file: string;
}

function Pdf({ file }: Props) {
	const classes = useStyles();
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState<number>(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
		setPageNumber(1);
	}

	function changePage(offset: number) {
		setPageNumber((prevPageNumber) => prevPageNumber + offset);
	}

	function previousPage() {
		changePage(-1);
	}

	function nextPage() {
		changePage(1);
	}

	return (
		<>
			<Document
				file={`/uploads/stream/${file}`}
				onLoadSuccess={onDocumentLoadSuccess}
				onLoadError={(error) => console.log(error.message)}
				onSourceError={(error) => console.log(error.message)}
				loading={<CircularProgress />}
				error={
					<Typography color="error">OOPS! Something went wrong</Typography>
				}
			>
				<Page pageNumber={pageNumber} />
			</Document>
			<div style={{ background: 'red' }}>
				<Fab
					disabled={pageNumber <= 1}
					onClick={previousPage}
					color="primary"
					className={classes.previous}
				>
					<ChevronLeft />
				</Fab>
				<Typography variant="caption" className={classes.pageNumbers}>
					Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
				</Typography>
				<Fab
					className={classes.next}
					color="primary"
					disabled={numPages ? pageNumber >= numPages : undefined}
					onClick={nextPage}
				>
					<ChevronRight />
				</Fab>
			</div>
		</>
	);
}

export default Pdf;
