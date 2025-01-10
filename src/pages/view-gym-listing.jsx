import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import "../assets/css/style.css";
import WhatsappBtnMain from "../components/WhatsappBtnMain";
import Slider from "react-slick";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axiosInstance, { businessListingAxiosInstance } from "../js/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import validator from "validator";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import User_img from "../assets/user-profile.png";
import { Modal, Button, Form } from "react-bootstrap";

const ViewGymListing = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const business_id = searchParams.get("business_id");
  const [businessData, setBusinessData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [timings, setTimings] = useState([]);
  const [amount, setAmount] = useState([]);
  const [services, setServices] = useState([]);
  const [tags, setTags] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [businessImages, setBusinessImages] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [userReviewsData, setUserReviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [currentStep, setCurrentStep] = useState("login");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLoginSubmit = async () => {
    try {
      const response = await axiosInstance.post("/account/authorization", {
        mobile: mobileNumber,
      });

      if (response.data && response.data.data && response.data.data.OTP) {
        setOtpDialogOpen(true);
        setCurrentStep("otp");
        setOtpCode(response.data.data.OTP);

        toast.success("OTP Sent! You will receive an OTP shortly.");
      } else {
        setOtpDialogOpen(true);
        setCurrentStep("otp");
        toast.success("OTP Sent! You will receive an OTP shortly.");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("Error in handleLoginSubmit:", error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        "/account/authorization/verify",
        {
          mobile: mobileNumber,
          otp: otpCode,
        }
      );

      const auth = response.data.data.authorization;

      if (response.status === 200) {
        localStorage.setItem("authorization", auth);
        setOtpDialogOpen(false);
        toast.success("OTP Verified!");
        setIsLogin(true);
        const activeServices = response.data.data.active_services;
        if (activeServices.includes("BUSINESS-LISTING")) {
          toast.success("Login Successful!");
        }
        handleSubmitReview();
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleOtpSubmit:", error);
    }
  };

  const handleGoBack = () => {
    setCurrentStep("login");
  };

  const fetchBusinessData = async () => {
    try {
      const requestData = {
        listing_id: [business_id],
      };

      const response = await businessListingAxiosInstance.post(
        "/get-businesses",
        requestData
      );
      const data = response.data.metadata;
      const fetchedBusinessData = response.data.data[0];
      const fetchedLocationData = fetchedBusinessData.locations[0];

      const contacts = fetchedBusinessData.contacts || [];
      setContacts(contacts);
      const amount = fetchedBusinessData.amount || [];
      setAmount(amount);
      const timing = fetchedBusinessData.timings || [];
      setTimings(timing);
      const services = fetchedBusinessData.services || [];
      setServices(services);
      const tags = fetchedBusinessData.tags || [];
      setTags(tags);
      const faqs = fetchedBusinessData.faqs || [];
      setFaqs(faqs);
      const business_img = fetchedBusinessData.business_images || [];
      setBusinessImages(business_img);

      setBusinessData(fetchedBusinessData);
      setLocationData(fetchedLocationData);
      setContactData(fetchedLocationData.contact);
      // setReviewData(fetchedBusinessData.review_stats);
      // setListNumber(data.pagination.total);
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
      console.error("Error in Getting Business Data:", error);
    }
  };

  const isValidWebsite = (website) => {
    return validator.isURL(website, { require_protocol: true });
  };

  const slides = businessImages.map((image, index) => ({
    src: "https://files.fggroup.in/" + image,
    caption: `Image ${index + 1}`,
  }));

  const openLightbox = (index) => {
    // setSelectedImage(index);
    // setLightboxOpen(true);
  };

  const handleSubmitReview = async () => {
    setIsLoading(true);
    try {
      const authData = localStorage.getItem("authorization");
      if (!authData) {
        handleShow();
        return;
      }

      if (!review || rating === 0) {
        toast.error("Please provide both review and rating.");
        return;
      }

      const requestData = {
        business_listing_id: business_id,
        comment: review,
        rating,
      };

      const response = await businessListingAxiosInstance.post(
        "/create-review",
        requestData
      );
      fetchBusinessData();
      fetchReviewsData();
      toast.success("Review submitted successfully");
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again.");
    }
    setIsLoading(false);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const fetchReviewsData = async () => {
    try {
      const response = await businessListingAxiosInstance.get(
        `/get-reviews?business_listing_id=${business_id}`
      );
      const fetchedReviewsData = response.data.data;
      setUserReviewData(fetchedReviewsData);
    } catch (error) {
      console.error("Error in Getting Reviews Data:", error);
    }
  };

  useEffect(() => {
    fetchBusinessData();
    fetchReviewsData();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>View Gym Listings - Find Top Fitness Centers Near You</title>
        <meta
          name="description"
          content="Explore detailed gym listings to discover fitness centers, programs, and amenities near you. Find the perfect gym to meet your fitness goals today!"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="images/favicon.ico"
        />
        <link href="css/styles.css" rel="stylesheet" />
      </Helmet>
      <WhatsappBtnMain
        message={"Hello, I wanted to know more about Business Listing."}
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
        <Header />
        <section
          className="view-gym-listing text-start"
          style={{ marginTop: "70px" }}
        >
          <div className="slider-container">
            <Slider {...settings}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="">
                    <img
                      src={slide.src}
                      alt={slide.caption}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
        <section className="gray py-5 position-relative text-start">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="bg-white rounded mb-4">
                  <div className="grouping-listings-single">
                    <div className="vrt-list-wrap">
                      <div className="vrt-list-wrap-head">
                        <div className="vrt-list-thumb">
                          <div className="vrt-list-thumb-figure">
                            <img
                              src={
                                "https://files.fggroup.in/" +
                                businessData?.business_images?.[0]
                              }
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="vrt-list-content">
                          <h4 className="mb-0 ft-medium">
                            <a
                              href="listing-search-v1.html"
                              className="text-dark fs-md"
                            >
                              {businessData.business_name}
                              <span className="verified-badge">
                                <i className="fas fa-check-circle"></i>
                              </span>
                            </a>
                          </h4>
                          <div className="Goodup-ft-first">
                            <div className="Goodup-rating">
                              <div className="Goodup-rates">
                                {Array.from({
                                  length:
                                    businessData.review_stats &&
                                    businessData.review_stats.average_rating,
                                }).map((_, starIndex) => (
                                  <StarIcon
                                    key={starIndex}
                                    sx={{
                                      fontSize: "16px",
                                      color: "#FFAE11",
                                    }}
                                  />
                                ))}
                                {Array.from({
                                  length:
                                    5 - businessData.review_stats &&
                                    businessData.review_stats.average_rating,
                                }).map((_, starIndex) => (
                                  <StarIcon
                                    key={starIndex}
                                    sx={{ fontSize: "16px", color: "#000" }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="Goodup-price-range">
                              <span className="small ft-medium">
                                {(businessData.review_stats &&
                                  businessData.review_stats.average_rating &&
                                  businessData.review_stats &&
                                  businessData.review_stats.average_rating.toFixed(
                                    1
                                  )) ||
                                  "0"}{" "}
                              </span>
                            </div>
                          </div>
                          {tags.length > 0 && (
                            <div className="vrt-list-features mt-2 mb-2">
                              <ul>
                                {tags.map((tags, index) => (
                                  <li>
                                    <a
                                      key={index}
                                      className="text-danger"
                                      href="javascript:void(0);"
                                    >
                                      {tags}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="vrt-list-desc">
                            <p className="vrt-qgunke">
                              Listed by GOMZI: These gyms, fitness centers, and
                              studios are handpicked to help you achieve your
                              fitness goals. Explore their unique facilities,
                              expert trainers, and personalized programs to find
                              the perfect fit for your journey.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="jb-apply-form bg-white rounded py-4 px-4 mb-4 d-md-none d-block">
                        <div className="coupon-details mt-3">
                          <h5>Price &amp; Taxes</h5>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                          <div className="_adv_features">
                            <ul>
                              <li>
                                Amount
                                <span>
                                  ₹ {businessData.amount?.paid_amount}
                                </span>
                              </li>
                              <li>
                                Discount
                                <span>
                                  - ₹{" "}
                                  {businessData.amount?.discount_amount || "0"}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                          <div className="Goodup-boo-space-foot mb-3">
                            <span className="Goodup-boo-space-left">
                              Total Payment
                            </span>
                            <h4 className="ft-bold theme-cl">
                              ₹{" "}
                              {businessData.amount?.paid_amount -
                                businessData.amount?.discount_amount}
                            </h4>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <a
                            href="#"
                            className="btn text-light rounded full-width theme-bg"
                          >
                            Book It Now
                          </a>
                        </div>
                      </div>
                      <div className="bg-white rounded d-md-none d-block">
                        <div className="jbd-01 px-4 py-2">
                          <div className="jbd-details mb-2">
                            <div className="Goodup-lot-wrap d-block">
                              <div className="row g-4">
                                <div className="col-12">
                                  <h5 className="ft-bold fs-lg">Live Site</h5>
                                  <div className="list-map-capt">
                                    <div className="lio-pact mt-3">
                                      {contacts.map(
                                        (contact, index) =>
                                          contact.contact_type === "website" &&
                                          isValidWebsite(contact.value) && (
                                            <a
                                              href={contact.value}
                                              target="_blank"
                                              className="text-dark"
                                              style={{ fontSize: "16px" }}
                                            >
                                              <span className="hkio-oilp ft-bold">
                                                {contact.value}
                                              </span>
                                            </a>
                                          )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded d-md-none d-block">
                        <div className="jbd-01 px-4 py-2">
                          <div className="jbd-details mb-2">
                            <div className="Goodup-lot-wrap d-block">
                              <div className="row g-4">
                                <div className="col-12">
                                  <h5 className="ft-bold fs-lg">Location</h5>
                                  <div className="list-map-capt">
                                    <div className="lio-pact mt-3">
                                      <span
                                        className="hkio-oilp ft-bold"
                                        style={{ fontSize: "16px" }}
                                      >
                                        {contactData.value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded d-md-none d-block">
                        <div className="jbd-01 px-4 py-2">
                          <div className="jbd-details mb-2">
                            <div className="Goodup-lot-wrap d-block">
                              <div className="row g-4">
                                <div className="col-12">
                                  <h5 className="ft-bold fs-lg">Location</h5>
                                  <div className="list-map-capt">
                                    <div className="lio-pact mt-3">
                                      <a
                                        href={locationData.direction_link}
                                        className="text-dark"
                                        style={{ fontSize: "16px" }}
                                      >
                                        <span className="hkio-oilp ft-bold">
                                          {locationData.address_line_1},{" "}
                                          {locationData.address_line_2},{" "}
                                          {locationData.landmark},{" "}
                                          {locationData.city},{" "}
                                          {locationData.state} -{" "}
                                          {locationData.pin_code}
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded d-md-none d-block">
                        <div className="jbd-01 px-4 py-2">
                          <div className="jbd-details mb-4">
                            <div className="Goodup-lot-wrap d-block">
                              <div className="row g-4">
                                <div className="col-12">
                                  <h5 className="ft-bold fs-lg">Drop a Mail</h5>
                                  <div className="list-map-capt">
                                    <div className="lio-pact mt-3">
                                      {contacts.map(
                                        (contact, index) =>
                                          contact.contact_type === "email" && (
                                            <span
                                              className="hkio-oilp ft-bold"
                                              style={{ fontSize: "16px" }}
                                            >
                                              {contact.value}
                                            </span>
                                          )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    {businessData?.description && (
                      <div className="jbd-details">
                        <h5 className="ft-bold fs-lg text-start">
                          About the Business
                        </h5>
                        <div className="d-block mt-3 text-start">
                          <p>{businessData?.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details">
                      <h5 className="ft-bold fs-lg">Amenities and More</h5>
                      {services.length > 0 && (
                        <div className="Goodup-all-features-list mt-3">
                          <ul>
                            {services.map((services, index) => (
                              <li>
                                <div className="Goodup-afl-pace">
                                  <img
                                    src="/images/verify.svg"
                                    className="img-fluid"
                                    alt=""
                                  />
                                  <span>{services}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details mb-4">
                      <div className="Goodup-lot-wrap d-block">
                        <div className="row g-4">
                          <div className="col-12">
                            <h5 className="ft-bold fs-lg">Working Hours</h5>
                            <table className="table table-borderless">
                              <tbody>
                                {timings.map((day, index) => (
                                  <tr>
                                    <th scope="row">{day.title}</th>
                                    <td>
                                      {day.timings.length > 0
                                        ? day.timings[0].from_time !==
                                            "00:00" &&
                                          day.timings[0].to_time !== "00:00"
                                          ? `${day.timings[0].from_time} - ${day.timings[0].to_time}`
                                          : "Closed"
                                        : "Closed"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details mb-4">
                      <h5 className="ft-bold fs-lg">Recommended Reviews</h5>
                      <div className="reviews-comments-wrap w-100">
                        {userReviewsData.map((review, index) => (
                          <div className="reviews-comments-item">
                            <div className="review-comments-avatar">
                              <img
                                src={`https://files.fggroup.in/${review.createdBy_user.profile_image}`}
                                className="img-fluid"
                                onError={(e) => {
                                  e.target.src = User_img;
                                }}
                                alt=""
                              />
                            </div>
                            <div className="reviews-comments-item-text">
                              <h4>
                                <a href="#">
                                  {review.createdBy_user.user_name}
                                </a>
                                <span className="reviews-comments-item-date">
                                  <i className="ti-calendar theme-cl me-1" />
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </h4>
                              {/* <span className="agd-location">
                                  {review.helpful_count}{" "}
                                  {review.helpful_count === 1
                                    ? "Review"
                                    : "Reviews"}
                                </span> */}
                              <div className="listing-rating high">
                                {Array.from({ length: review.rating }).map(
                                  (_, starIndex) => (
                                    <StarIcon
                                      key={starIndex}
                                      sx={{
                                        fontSize: "16px",
                                        color: "#FFAE11",
                                      }}
                                    />
                                  )
                                )}
                                {Array.from({
                                  length: 5 - review.rating,
                                }).map((_, starIndex) => (
                                  <StarIcon
                                    key={starIndex}
                                    sx={{ fontSize: "16px", color: "#000" }}
                                  />
                                ))}
                              </div>
                              <div className="clearfix" />
                              <p>{review.comment}</p>
                            </div>
                          </div>
                        ))}

                        {userReviewsData.length === 0 && !setLoading && (
                          <h5>No Review Found</h5>
                        )}
                        {isLoading && (
                          <div className="w-100 d-flex justify-content-center">
                            <div class="spinner-box spinner-width">
                              <div class="three-quarter-spinner three-quarter-spinner-width"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details">
                      <h5 className="ft-bold fs-lg">Drop Your Review</h5>
                      <div className="review-form-box form-submit mt-3">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group mb-3">
                              <textarea
                                className="form-control rounded ht-140"
                                placeholder="Review"
                                defaultValue={""}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group mb-3">
                              <label className="ft-medium small mb-1">
                                Select Rating
                              </label>
                              <div className="d-flex mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    sx={{
                                      fontSize: "25px",
                                      color:
                                        rating >= star ? "#FFAE11" : "#000",
                                    }}
                                    onClick={() => handleRatingChange(star)}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group">
                              <button
                                onClick={handleSubmitReview}
                                className="btn theme-bg text-light rounded"
                              >
                                Submit Review
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-block mb-2">
                  {faqs.length > 0 && (
                    <div className="jbd-01 py-2">
                      <div className="jbd-details">
                        <h5 className="ft-bold fs-lg">
                          Frequently Asked Questions
                        </h5>
                        <div className="d-block mt-3">
                          {faqs.map((faq, index) => (
                            <div id="accordion2" className="accordion">
                              <div className="card">
                                <div
                                  className="card-header"
                                  id={`heading-${index}`}
                                >
                                  <h5 className="mb-0">
                                    <button
                                      className="btn btn-link"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#ord7"
                                      aria-expanded="true"
                                      aria-controls="ord7"
                                    >
                                      {index + 1}. {faq.question}
                                    </button>
                                  </h5>
                                </div>
                                <div
                                  id="ord7"
                                  className="collapse show"
                                  aria-labelledby="h7"
                                  data-parent="#accordion2"
                                >
                                  <div className="card-body">{faq.answer}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 price-section d-md-block d-none">
                <div className="jb-apply-form bg-white rounded py-4 px-4 mb-4">
                  <div className="coupon-details mt-3">
                    <h5>Price &amp; Taxes</h5>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                    <div className="_adv_features">
                      <ul>
                        <li>
                          Amount
                          <span>₹ {businessData.amount?.paid_amount}</span>
                        </li>
                        <li>
                          Discount
                          <span>
                            - ₹ {businessData.amount?.discount_amount || "0"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                    <div className="Goodup-boo-space-foot mb-3">
                      <span className="Goodup-boo-space-left">
                        Total Payment
                      </span>
                      <h4 className="ft-bold theme-cl">
                        ₹{" "}
                        {businessData.amount?.paid_amount -
                          businessData.amount?.discount_amount}
                      </h4>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <a
                      href="#"
                      className="btn text-light rounded full-width theme-bg"
                    >
                      Book It Now
                    </a>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details mb-4">
                      <div className="Goodup-lot-wrap d-block">
                        <div className="row g-4">
                          <div className="col-12">
                            <h5 className="ft-bold fs-lg">Live Site</h5>
                            <div className="list-map-capt">
                              <div className="lio-pact mt-3">
                                {contacts.map(
                                  (contact, index) =>
                                    contact.contact_type === "website" &&
                                    isValidWebsite(contact.value) && (
                                      <a
                                        href={contact.value}
                                        target="_blank"
                                        className="text-dark"
                                        style={{ fontSize: "16px" }}
                                      >
                                        <span className="hkio-oilp ft-bold">
                                          {contact.value}
                                        </span>
                                      </a>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details mb-4">
                      <div className="Goodup-lot-wrap d-block">
                        <div className="row g-4">
                          <div className="col-12">
                            <h5 className="ft-bold fs-lg">Location</h5>
                            <div className="list-map-capt">
                              <div className="lio-pact mt-3">
                                <span
                                  className="hkio-oilp ft-bold"
                                  style={{ fontSize: "16px" }}
                                >
                                  {contactData.value}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details mb-4">
                      <div className="Goodup-lot-wrap d-block">
                        <div className="row g-4">
                          <div className="col-12">
                            <h5 className="ft-bold fs-lg">Location</h5>
                            <div className="list-map-capt">
                              <div className="lio-pact mt-3">
                                <a
                                  href={locationData.direction_link}
                                  className="text-dark"
                                  style={{ fontSize: "16px" }}
                                >
                                  <span className="hkio-oilp ft-bold">
                                    {locationData.address_line_1},{" "}
                                    {locationData.address_line_2},{" "}
                                    {locationData.landmark}, {locationData.city}
                                    , {locationData.state} -{" "}
                                    {locationData.pin_code}
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded mb-4">
                  <div className="jbd-01 px-4 py-4">
                    <div className="jbd-details mb-4">
                      <div className="Goodup-lot-wrap d-block">
                        <div className="row g-4">
                          <div className="col-12">
                            <h5 className="ft-bold fs-lg">Drop a Mail</h5>
                            <div className="list-map-capt">
                              <div className="lio-pact mt-3">
                                {contacts.map(
                                  (contact, index) =>
                                    contact.contact_type === "email" && (
                                      <span
                                        className="hkio-oilp ft-bold"
                                        style={{ fontSize: "16px" }}
                                      >
                                        {contact.value}
                                      </span>
                                    )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />

        <Modal
          show={showModal && currentStep === "login"}
          onHide={handleClose}
          centered
        >
          <div class="modal-headers">
            <button type="button" class="close" onClick={handleClose}>
              <span class="ti-close"></span>
            </button>
          </div>
          <Modal.Body className="p-5">
            <a
              className="nav-brand d-flex justify-content-center align-items-center"
              href="#"
            >
              <img src="images/logo.png" className="logo" alt="" />
            </a>
            <h3 className="text-center">Welcome</h3>
            <div class="text-center mb-5">
              <h4 class="m-0 ft-medium">Login for a seamless experience</h4>
            </div>
            <Form>
              <Form.Group controlId="mobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile Number*"
                  className="rounded bg-light"
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </Form.Group>

              <div className="text-center my-3">
                <Button
                  variant="primary"
                  className="w-100 theme-bg text-light rounded ft-medium"
                  onClick={handleLoginSubmit}
                >
                  Sign In
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={otpDialogOpen && currentStep === "otp"}
          onHide={() => setOtpDialogOpen(false)}
          centered
        >
          <div class="modal-headers">
            <button
              type="button"
              class="close"
              onClick={() => setOtpDialogOpen(false)}
            >
              <span class="ti-close"></span>
            </button>
          </div>
          <Modal.Body className="p-5">
            <a
              className="nav-brand d-flex justify-content-center align-items-center"
              href="#"
            >
              <img src="images/logo.png" className="logo" alt="" />
            </a>
            <div class="text-center mb-4">
              <h4 class="m-0 ft-medium">OTP Verification</h4>
            </div>
            <Form>
              <Form.Group controlId="mobile">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP*"
                  className="rounded bg-light"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </Form.Group>
              <div className="text-center row justify-content-center mt-4 my-3">
                <div className="col-5">
                  <Button
                    variant="primary"
                    className="w-100 bg-dark text-light rounded ft-medium"
                    onClick={handleGoBack}
                  >
                    Back
                  </Button>
                </div>
                <div className="col-5">
                  <Button
                    variant="primary"
                    className="w-100 theme-bg text-light rounded ft-medium"
                    onClick={handleOtpSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
};

export default ViewGymListing;
