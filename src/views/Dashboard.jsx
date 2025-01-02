import React, { useState } from 'react'
// node.js library that concatenates classes (strings)
// react plugin used to create charts
import { Line } from 'react-chartjs-2'
import stats from '../assets/img/stats.png'
import RiderStat from '../assets/img/RiderStat.png'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import {
  Box,
  Typography,
  Input,
  Button,
  Container,
  Grid,
  useTheme
} from '@mui/material'
import Header from '../components/Headers/Header'
import { useQuery, gql } from '@apollo/client'
import {
  getDashboardTotal,
  getDashboardSales,
  getDashboardOrders,
  getOrdersByDateRange
} from '../apollo'

import useStyles from '../components/Option/styles'
import useGlobalStyles from '../utils/globalStyles'
import { withTranslation } from 'react-i18next'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const GET_DASHBOARD_TOTAL = gql`
  ${getDashboardTotal}
`
const GET_DASHBOARD_SALES = gql`
  ${getDashboardSales}
`
const GET_DASHBOARD_ORDERS = gql`
  ${getDashboardOrders}
`
const GET_ORDERS = gql`
  ${getOrdersByDateRange}
`

const Dashboard = props => {
  const { t } = props
  const theme = useTheme()
  const restaurantId = localStorage.getItem('restaurantId')

  const dataLine = {
    datasets: {
      label: t('SalesAmount'),
      // label: 'Sales Amount',
      backgroundColor: theme.palette.secondary.darkest,
      borderColor: theme.palette.secondary.darkest
    }
  }
  const dataBar = {
    datasets: {
      label: t('OrderCount'),
      // label: 'Order count',
      backgroundColor: theme.palette.warning.dark,
      borderColor: theme.palette.warning.dark
    }
  }

  // const intializeStartDate = () => {
  //   var d = new Date()
  //   d.setDate(d.getDate() - 7)
  //   return d.toISOString().substr(0, 10)
  // }

  // const [stateData, setStateData] = useState({
  //   startingDate: intializeStartDate(), // new Date().toISOString().substr(0,10),
  //   endingDate: new Date().toISOString().substr(0, 10)
  // })

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  }

  // Function to initialize start date (7 days ago)
  const intializeStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  }

  // Initialize state
  const [stateData, setStateData] = useState({
    startingDate: intializeStartDate(),
    endingDate: getCurrentDate()
  });

  const {
    data: dataTotal,
    error: errorTotal,
    loading: loadingTotal
  } = useQuery(GET_DASHBOARD_TOTAL, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  const {
    data: dataSales,
    error: errorSales,
    loading: loadingSales
  } = useQuery(GET_DASHBOARD_SALES, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  const { data: dataOrders, loading: loadingOrders } = useQuery(
    GET_DASHBOARD_ORDERS,
    {
      variables: {
        startingDate: stateData.startingDate.toString(),
        endingDate: stateData.endingDate.toString(),
        restaurant: restaurantId
      }
    }
  )

  const { data, loading: loadingQuery } = useQuery(GET_ORDERS, {
    variables: {
      startingDate: stateData.startingDate.toString(),
      endingDate: stateData.endingDate.toString(),
      restaurant: restaurantId
    }
  })
  console.log('getOrdersByDateRange', data)
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <>
      <Header />
      <Container className={globalClasses.flex} fluid>
        {errorTotal ? <span>{`${Error} + ${errorTotal.message}`}</span> : null}
        <Box container className={classes.container}>
          <Box className={classes.flexRow}>
            <Box item className={classes.heading}>
              <Typography variant="h6" className={classes.textWhite}>
                {t('GraphFilter')}
              </Typography>
            </Box>
          </Box>

          <Box className={classes.form}>
            <form>
              <Grid container sx={{ textAlign: 'left' }}>
                <Grid item md={6} xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {t('StartDate')}
                  </Typography>
                  {/* <Input
                    style={{ marginTop: -1 }}
                    type="date"
                    max={new Date().toISOString().substr(0, 10)}
                    onChange={event => {
                      setStateData({
                        ...stateData,
                        startingDate: event.target.value
                      })
                    }}
                    value={stateData.startingDate}
                    disableUnderline
                    className={[globalClasses.input]}
                  /> */}
                  <Input
                    style={{ marginTop: -1 }}
                    type="date"
                    max={stateData.endingDate} // Restrict to end date
                    onChange={event => {
                      const selectedDate = event.target.value;
                      const currentDate = getCurrentDate();

                      // Allow only if selected date is not future date and less than end date
                      if (selectedDate <= currentDate && selectedDate < stateData.endingDate) {
                        setStateData({
                          ...stateData,
                          startingDate: selectedDate
                        });
                      }
                    }}
                    value={stateData.startingDate}
                    disableUnderline
                    className={[globalClasses.input]}
                    sx={{
                      '& input': {
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'invert(0.5)',
                          cursor: 'pointer'
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '20px',
                        background: 'transparent',
                        pointerEvents: 'none'
                      }
                    }}
                  />

                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {t('EndDate')}
                  </Typography>
                  {/* <Input
                    style={{ marginTop: -1 }}
                    type="date"
                    max={new Date().toISOString().substr(0, 10)}
                    onChange={event => {
                      setStateData({
                        ...stateData,
                        endingDate: event.target.value
                      })
                    }}
                    value={stateData.endingDate}
                    disableUnderline
                    className={[globalClasses.input]}
                  /> */}

                  <Input
                    style={{ marginTop: -1 }}
                    type="date"
                    min={stateData.startingDate} // Must be after start date
                    max={getCurrentDate()} // Can't be future date
                    onChange={event => {
                      const selectedDate = event.target.value;
                      const currentDate = getCurrentDate();

                      // Allow only if selected date is not future date and greater than start date
                      if (selectedDate <= currentDate && selectedDate > stateData.startingDate) {
                        setStateData({
                          ...stateData,
                          endingDate: selectedDate
                        });
                      }
                    }}
                    value={stateData.endingDate}
                    disableUnderline
                    className={[globalClasses.input]}
                    sx={{
                      '& input': {
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'invert(0.5)',
                          cursor: 'pointer'
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '20px',
                        background: 'transparent',
                        pointerEvents: 'none'
                      }
                    }}
                  />

                </Grid>
              </Grid>
              <Button className={globalClasses.button}>{t('Apply')}</Button>
            </form>
          </Box>
        </Box>
      </Container>
      <Grid container spacing={2} m={2} p={2}>
        <Grid item md={8} xs={12}>
          <Box
            sx={{
              bgcolor: 'primary.main2',
              height: '70px',
              width: '70px',
              borderRadius: '50%',
              marginLeft: '94%'
            }}
          />
          <Box
            sx={{
              bgcolor: theme.palette.info.light,
              boxShadow: `0px 0px 11px ${theme.palette.info.dark}`,
              borderRadius: 3,
              p: 2,
              position: 'relative',
              zIndex: 999,
              marginTop: -8
            }}>
            {errorSales ? null : null}
            <Line
              height={400}
              data={{
                labels: loadingSales
                  ? []
                  : dataSales &&
                  dataSales.getDashboardSales.orders.map(d => d.day),
                datasets: [
                  {
                    ...dataLine.datasets,
                    data: loadingSales
                      ? []
                      : dataSales &&
                      dataSales.getDashboardSales.orders.map(d => d.amount),
                    lineTension: 0.8
                  },
                  {
                    ...dataBar.datasets,
                    data: loadingOrders
                      ? []
                      : dataOrders &&
                      dataOrders.getDashboardOrders.orders.map(d => d.count)
                  }
                ]
              }}
              options={{
                maintainAspectRatio: false,
                legend: {
                  labels: {
                    display: false,
                    fontColor: theme.palette.common.white,
                    fontSize: 10
                  }
                },
                scales: {
                  yAxes: {
                    grid: {
                      color: theme.palette.common.white
                    },
                    ticks: {
                      color: theme.palette.secondary.main,
                      fontSize: 12
                    }
                  },
                  xAxes: {
                    grid: {
                      color: theme.palette.common.white
                    },
                    ticks: {
                      color: theme.palette.secondary.main,
                      fontSize: 12
                    }
                  }
                }
              }}
            />
          </Box>
          <Box
            sx={{
              bgcolor: 'primary.main',
              height: '90px',
              width: '90px',
              borderRadius: '50%',
              marginTop: -10,
              ml: -1
            }}
          />
        </Grid>
        <Grid item md={3} ml={2} xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: 'common.white',
              width: '70%',
              mb: 3
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
              {t('TotalOrders')}
            </Typography>
            <Typography
              sx={{
                fontSize: 35,
                fontWeight: 'bold',
                color: theme.palette.secondary.lightest,
                textAlign: 'center'
              }}>
              {loadingTotal
                ? '...'
                : dataTotal && dataTotal.getDashboardTotal.totalOrders}
            </Typography>

            <img
              src={stats}
              style={{ marginLeft: '40%' }}
              width={30}
              height={40}
              alt="stat"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: 'common.white',
              width: '70%',
              mb: 3
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
              COD Orders
            </Typography>

            <Typography
              sx={{
                fontSize: 35,
                fontWeight: 'bold',
                color: '#3C8F7C',
                textAlign: 'center'
              }}>
              {loadingQuery
                ? '...'
                : data && data.getOrdersByDateRange.countCashOnDeliveryOrders}
            </Typography>
            <img
              src={stats}
              style={{ marginLeft: '40%' }}
              width={30}
              height={40}
              alt="stat"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: 'common.white',
              width: '70%',
              mb: 3
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
              {t('TotalSales')}
            </Typography>
            <Typography
              sx={{
                fontSize: 35,
                fontWeight: 'bold',
                color: theme.palette.secondary.lightest,
                textAlign: 'center'
              }}>
              {loadingTotal
                ? '...'
                : dataTotal && dataTotal.getDashboardTotal.totalSales}
            </Typography>
            <img
              src={RiderStat}
              style={{ marginLeft: '40%' }}
              width={30}
              height={40}
              alt="stat"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 5,
              bgcolor: 'common.white',
              width: '70%',
              mb: 3
            }}>
            <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>
              COD Sales
            </Typography>
            <Typography
              sx={{
                fontSize: 35,
                fontWeight: 'bold',
                color: '#3C8F7C',
                textAlign: 'center'
              }}>
              {loadingQuery
                ? '...'
                : data && data.getOrdersByDateRange.totalAmountCashOnDelivery}
            </Typography>
            <img
              src={stats}
              style={{ marginLeft: '40%' }}
              width={30}
              height={40}
              alt="stat"
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default withTranslation()(Dashboard)
