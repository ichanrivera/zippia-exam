import styles from '../styles/Home.module.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import moment from 'moment';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Grid,
  GridColumn,
  Select,
  Header,
} from 'semantic-ui-react';
import NavMenu from '../components/NavMenu';

export default function Home({ jobs }) {
  const [jobList, setJobList] = useState([]);
  const [companies, setcompanies] = useState([]);

  const populateCompanyOptions = () => {
    //Filter companies by unique name
    const companies = [...new Set(jobs.map((job) => job.companyName))];
    // add to object in array for select component
    const populateList = companies.map((item) => ({ value: item, text: item }));
    // set list in state
    setcompanies(populateList);
  };

  // Set jobs list from Static props on load
  useEffect(() => {
    setJobList(jobs);
    //populate option in company select dropdown
    populateCompanyOptions();
  }, []);

  const handleSelectCompany = (e, data) => {
    // get selected data from dropdown and filter jobs
    const jobList = jobs.filter(
      (company) => company.companyName === data.value
    );
    // set jobs from filtered jobs
    setJobList(jobList);
  };

  const handleGetLatestJobs = () => {
    //get date now and subtract 7 days and format to timestamp
    const filter = moment().subtract(7, 'd').format('X');
    // filter jobs in state to match the 7 days margin
    const jobList = jobs.filter(
      (company) => moment(company.OBJpostingDate).format('X') > filter
    );
    // set the filtered jobs to the jobs in state
    setJobList(jobList);
  };

  return (
    <div>
      <NavMenu />
      <Grid stackable doubling centered columns={5}>
        <Grid.Row>
          <Grid.Column>
            <Header textAlign='center' as='h1' content='Zippia ' />
            <Header
              textAlign='center'
              as='h3'
              content='Get the job you really want '
            />
            <Header
              textAlign='center'
              as='h5'
              content='Discover your options with your personalized career search '
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns='equal'>
          <Grid.Column stackable textAlign='center'>
            <Select
              className={styles.select}
              placeholder='Select by Company'
              search
              options={companies}
              onChange={handleSelectCompany}
              name='selectCompany'
            />
            <Button
              className={styles.buttons}
              color='green'
              onClick={handleGetLatestJobs}
            >
              Get Latest Jobs (7 days)
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {jobList.slice(0, 10).map((job, index) => (
            <Grid.Column stretched stackable key={job.jobId} width={3}>
              <Card
                color='blue'
                className={styles.card}
                index={index}
                header={job.OBJtitleDisplay}
                meta={job.OBJcompanyDisplay}
                description={`${job.shortDesc}...`}
              />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export const getStaticProps = async () => {
  const requestData = {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    jobTitle: 'Business Analyst',
    locations: [],
    numJobs: 20,
    previousListingHashes: [],
  };

  const response = await axios({
    method: 'post',
    url: 'https://www.zippia.com/api/jobs/',
    data: requestData,
  });

  const jobs = response.data.jobs;

  return {
    props: {
      jobs,
    },
  };
};
