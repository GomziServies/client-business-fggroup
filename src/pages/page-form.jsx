import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import "../assets/css/style.css";
import Footer from "../components/Footer";
import WhatsappBtnMain from "../components/WhatsappBtnMain";
import Header from "../components/Header";

const BuyFormComponent = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div>
            <Helmet>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Explore All Gym Listings - Find Fitness Centers Near You</title>
                <meta
                    name="description"
                    content="Browse our comprehensive gym listings to find fitness centers, gyms, and wellness facilities near you. Connect with the perfect gym for your fitness goals!"
                />
                <link
                    rel="shortcut icon"
                    type="image/x-icon"
                    href="images/favicon.ico"
                />
                <link href="css/styles.css" rel="stylesheet" />
            </Helmet>
            <WhatsappBtnMain
                message={"Hello, I wanted to know more about Gym Listing."}
                options={{ pageRef: true }}
            />
            <>
                {loading && (
                    <div className="loader-background">
                        <div className="spinner-box">
                            <div className="three-quarter-spinner"></div>
                        </div>
                    </div>
                )}
                <div id="main-wrapper">
                    <Header />
                    <section className="gray page-form-section">
                        <div className="container">
                            <div className="row">

                                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                    <div className="d-block"><h4 className="ft-medium">Personal Detail</h4></div>
                                    <div className="single-form-item bg-white rounded px-3 py-3 mb-4">
                                        <div className="row submit-form">

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="mb-1">First Name</label>
                                                    <input type="text" className="form-control rounded" value="Umang" />
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="mb-1">Last name</label>
                                                    <input type="text" className="form-control rounded" value="Rathod" />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="mb-1">Email</label>
                                                    <input type="text" className="form-control rounded" value="fitnesswithgomzi@gmail.com" />
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="mb-1">Mobile</label>
                                                    <input type="text" className="form-control rounded" value="+91 9889783455" />
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12 single-form-item mb-4 mt-3">
                                                <div className="d-block"><button type="button" className="btn theme-bg text-light ft-medium rounded">Submit &amp; Continue</button></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="single-form-item mb-4">
                                        <div className="d-block"><button type="button" className="btn theme-bg text-light ft-medium rounded">Submit &amp; Continue</button></div>
                                    </div> */}
                                </div>

                                <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                    <div className="biiling-wrap mb-4">
                                        <div className="billing-item">
                                            <div className="Goodup-grid-wrap mb-0">
                                                <div className="Goodup-grid-upper">
                                                    <div className="Goodup-grid-thumb">
                                                        <a href="single-listing-detail-3.html" className="d-block text-center m-auto"><img src="/images/gym-listing-banner.webp" className="img-fluid" alt="" /></a>
                                                    </div>

                                                    <div className="Goodup-rating overlay">
                                                        <div className="Goodup-pr-average high">5.0</div>
                                                        <div className="Goodup-aldeio">
                                                            <div className="Goodup-rates">
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star"></i>
                                                            </div>
                                                            <div className="Goodup-all-review"><span>10 Reviews</span></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="billing-item-head">
                                            <h5 className="ft-medium mb-1">The Gold Hotel Lalit</h5>
                                            <div className="Goodup-location"><i className="fas fa-map-marker-alt text-muted me-2"></i>Montreal, Australia</div>
                                        </div> */}
                                        <div className="billing-item-middle mt-3">
                                            <div className="billing-its-title"><h4>Booking Details</h4></div>
                                            <div className="billing-item-lists">
                                                <ul>
                                                    <li><span className="prt-title">Amount:</span><span className="prt-value">₹26000</span></li>
                                                    <li><span className="prt-title">Discount :</span><span className="prt-value">₹1000</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="billing-item-foot">
                                            <div className="blg-fgty">
                                                <h5 className="ft-medium">Total Amount:</h5>
                                                <h6 className="theme-cl ft-bold">₹25000</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            </>
        </div>
    );
};

export default BuyFormComponent;
