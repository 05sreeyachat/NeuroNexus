import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress, Button, Card, CardContent, LinearProgress } from '@mui/material';
// Replace individual icon imports with this consolidated import
import { Refresh as RefreshIcon, Assignment as AssignmentIcon, Folder as FolderIcon, Timeline as TimelineIcon } from '@mui/icons-material';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    tasks: [],
    recentActivities: []
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [projectsRes, tasksRes] = await Promise.all([
        fetch('http://localhost:5000/api/projects', { headers }),
        fetch('http://localhost:5000/api/tasks', { headers })
      ]);

      const projects = await projectsRes.json();
      const tasks = await tasksRes.json();

      setDashboardData({
        projects,
        tasks,
        recentActivities: [...projects, ...tasks].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getProjectStats = () => {
    const total = dashboardData.projects.length;
    const completed = dashboardData.projects.filter(p => p.status === 'Completed').length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  };

  const getTaskStats = () => {
    const total = dashboardData.tasks.length;
    const completed = dashboardData.tasks.filter(t => t.status === 'Done').length;
    const inProgress = dashboardData.tasks.filter(t => t.status === 'In Progress').length;
    const todo = total - completed - inProgress;
    return { total, completed, inProgress, todo };
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const projectStats = getProjectStats();
  const taskStats = getTaskStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ 
          color: '#1a237e',
          display: 'flex',
          alignItems: 'center',
          gap: 2 
        }}>
          <TimelineIcon sx={{ fontSize: 32 }} />
          Dashboard Overview
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          sx={{ 
            px: 3,
            py: 1.5,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FolderIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6">Projects Overview</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Total Projects: {projectStats.total}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }} 
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Completed: {projectStats.completed}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(projectStats.completed / projectStats.total) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }} 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            background: 'linear-gradient(135deg, #ff4081 0%, #c60055 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AssignmentIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6">Tasks Overview</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              {Object.entries(taskStats).map(([key, value]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, textTransform: 'capitalize' }}>
                    {key}: {value}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(value / taskStats.total) * 100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'white'
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1a237e' }}>
              Recent Activities
            </Typography>
            <Box sx={{ mt: 2 }}>
              {dashboardData.recentActivities.map((activity, index) => (
                <Card 
                  key={index} 
                  sx={{ 
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(33, 150, 243, 0.04)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" sx={{ color: '#37474f' }}>
                      {activity.title}
                      <Box component="span" sx={{ 
                        float: 'right', 
                        fontSize: '0.8rem',
                        color: 'text.secondary' 
                      }}>
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </Box>
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;