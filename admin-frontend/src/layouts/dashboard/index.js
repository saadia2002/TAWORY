import React from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Dashboard Content
function Dashboard() {
    const { sales, tasks } = reportsLineChartData;

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <MDBox py={3}>
                <Grid container spacing={3}>
                    {/* Services Card */}
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="business_center"
                                title="Services Disponibles"
                                count={120}
                                percentage={{
                                    color: "success",
                                    amount: "+10%",
                                    label: "plus que le mois dernier",
                                }}
                            />
                        </MDBox>
                    </Grid>

                    {/* Reservations Card */}
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                icon="event"
                                title="Réservations Actuelles"
                                count="85"
                                percentage={{
                                    color: "success",
                                    amount: "+15%",
                                    label: "plus que la semaine dernière",
                                }}
                            />
                        </MDBox>
                    </Grid>

                    {/* Revenue Card */}
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="success"
                                icon="attach_money"
                                title="Revenus des Services"
                                count="45k"
                                percentage={{
                                    color: "success",
                                    amount: "+5%",
                                    label: "plus que le mois dernier",
                                }}
                            />
                        </MDBox>
                    </Grid>

                    {/* Active Users Card */}
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="person"
                                title="Utilisateurs Actifs"
                                count="+320"
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: "Juste mis à jour",
                                }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>

            {/* Additional Statistics Cards */}

            {/* Description Section with Image */}
            <MDBox py={3}>
                <Grid container spacing={3} alignItems="center">
                    {/* Text Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ backgroundColor: "#fff", boxShadow: 5, borderRadius: 2, padding: 3 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: "#333" }}>
                                    Bienvenue sur notre plateforme
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
                                    Découvrez notre gamme complète de services et produits. Nous nous engageons à offrir à nos clients des solutions personnalisées et de qualité, adaptées à leurs besoins spécifiques. Explorez nos offres et profitez d'une expérience utilisateur optimale.
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    Nos services incluent la gestion de projets, des réservations en ligne faciles et sécurisées, ainsi qu'un suivi personnalisé pour chaque client. Vous pouvez également consulter les avis de nos clients et nous contacter directement via notre plateforme.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Image Section */}
                    <Grid item xs={12} md={6}>
                        <img
                            src="https://www.kaustrucks.nl/img/services.jpg" // Remplacez par l'URL de votre image
                            alt="Illustration"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </Grid>
                </Grid>
            </MDBox>

            {/* Orders Overview Section */}
            <MDBox mb={1.5}>
                <OrdersOverview />
            </MDBox>

            {/* Projects Section */}
            <MDBox mb={1.5}>
                <Projects />
            </MDBox>

            {/* Comment Section */}
            <MDBox mb={1.5}>
                <Card sx={{ backgroundColor: "#fff", boxShadow: 5, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: "#333" }}>
                            Commentaires Clients
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                            Voici quelques commentaires récents de nos clients concernant nos services :
                        </Typography>

                        {/* Comment 1 */}
                        <MDBox mt={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="textPrimary" sx={{ flex: 1 }}>
                                "Le service est excellent, très réactif et professionnel!"
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 2 }}>
                                - Client A
                            </Typography>
                        </MDBox>

                        {/* Comment 2 */}
                        <MDBox mt={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="textPrimary" sx={{ flex: 1 }}>
                                "Très satisfait des services, à recommander à d'autres."
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 2 }}>
                                - Client B
                            </Typography>
                        </MDBox>

                        {/* Comment 3 */}
                        <MDBox mt={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="textPrimary" sx={{ flex: 1 }}>
                                "La qualité a augmenté, mais les délais sont parfois longs."
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 2 }}>
                                - Client C
                            </Typography>
                        </MDBox>
                    </CardContent>
                </Card>
            </MDBox>

            <Footer />
        </DashboardLayout>
    );
}

export default Dashboard;
