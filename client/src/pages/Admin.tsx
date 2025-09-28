import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
} from '@mui/icons-material';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminProducts from '../components/Admin/AdminProducts';
import AdminOrders from '../components/Admin/AdminOrders';
import AdminUsers from '../components/Admin/AdminUsers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab
              icon={<Dashboard />}
              label="Dashboard"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab
              icon={<Inventory />}
              label="Products"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
            <Tab
              icon={<ShoppingCart />}
              label="Orders"
              id="admin-tab-2"
              aria-controls="admin-tabpanel-2"
            />
            <Tab
              icon={<People />}
              label="Users"
              id="admin-tab-3"
              aria-controls="admin-tabpanel-3"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <AdminDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AdminProducts />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AdminOrders />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AdminUsers />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Admin;
