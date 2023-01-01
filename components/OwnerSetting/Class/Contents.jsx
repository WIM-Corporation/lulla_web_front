export default () => {
  return (
    <main className="admin_box">
      <div className="adm_box">
        <div className="adm_header2">
          <p className="adm_title">반</p>
          <p className="adm_subtext">
            반의 신규 등록과 정보 수정이 가능합니다. 반 운영 정보에 따라 소속된
            구성원의 계정 권한이 변경됩니다. <br />
            종료일 있음 : 종료일에 맞춰 소속된 구성원의 계정 권한이 비활성
            됩니다. 계정 비활성화 시 해당 계정의 사용 및 복구가 불가합니다.{" "}
            <br />
            종료일 없음 : 소속된 구성원의 계정 권한이 유지됩니다.
          </p>
        </div>
        <section className="sec_2">
          <div className="adm_input_box">
            <ul className="adm_inputList">
              <li className="adm_inputItem">
                <p className="adm_inputTitle">반 이름</p>
                <div className="adm_inputBox2">
                  <input
                    type="text"
                    className="info_input adm_warring"
                    placeholder="반이름"
                  />
                  <p className="warring_text2">반 이름을 입력해주세요.</p>
                </div>
              </li>
              <li className="adm_inputItem">
                <p className="adm_inputTitle">운영 기간</p>
                <div className="adm_inputBox2">
                  <div className="setting_tab_box">
                    <div className="setting_selectbox2">
                      <div className="selectBox adm_datepicker active">
                        {/* <div className="select_first">시작일</div> */}
                        <div className="select_value2">2022. 1. 30. (월)</div>

                        {/* <div className="datepicker_box2">
                              <div className="datepicker_header">
                                <div className="date_prev"></div>
                                <div className="date_hd_box">
                                  <div className="date_year">2022년</div>
                                  <div className="date_month">4월</div>
                                </div>
                                <div className="date_next"></div>
                              </div>
    
                              <div className="datepicker_body">
                                <div className="datepicker_tbl">
                                  <div className="datepicker_row">
                                    <div className="datepicker_td week_point">
                                      일
                                    </div>
                                    <div className="datepicker_td">
                                      월
                                    </div>
                                    <div className="datepicker_td">
                                      화
                                    </div>
                                    <div className="datepicker_td">
                                      수
                                    </div>
                                    <div className="datepicker_td">
                                      목
                                    </div>
                                    <div className="datepicker_td">
                                      금
                                    </div>
                                    <div className="datepicker_td week_point2">
                                      일
                                    </div>
                                  </div>
    
                                  <div className="datepicker_row">
                                    <div className="datepicker_td date_disalbed week_point">26</div>
                                    <div className="datepicker_td date_disalbed">27</div>
                                    <div className="datepicker_td date_disalbed">28</div>
                                    <div className="datepicker_td date_disalbed">29</div>
                                    <div className="datepicker_td date_disalbed">30</div>
                                    <div className="datepicker_td date_disalbed">31</div>
                                    <div className="datepicker_td date_disalbed week_point2">1</div>
                                  </div>
    
                                  <div className="datepicker_row">
                                    <div className="datepicker_td date_disalbed week_point">2</div>
                                    <div className="datepicker_td">3</div>
                                    <div className="datepicker_td">4</div>
                                    <div className="datepicker_td on">5</div>
                                    <div className="datepicker_td">6</div>
                                    <div className="datepicker_td">7</div>
                                    <div className="datepicker_td week_point2">8</div>
                                  </div>
    
                                  <div className="datepicker_row">
                                    <div className="datepicker_td week_point">9</div>
                                    <div className="datepicker_td">10</div>
                                    <div className="datepicker_td">11</div>
                                    <div className="datepicker_td">12</div>
                                    <div className="datepicker_td">13</div>
                                    <div className="datepicker_td">14</div>
                                    <div className="datepicker_td week_point2">15</div>
                                  </div>
    
                                  <div className="datepicker_row">
                                    <div className="datepicker_td week_point">16</div>
                                    <div className="datepicker_td">17</div>
                                    <div className="datepicker_td">18</div>
                                    <div className="datepicker_td">19</div>
                                    <div className="datepicker_td">20</div>
                                    <div className="datepicker_td">21</div>
                                    <div className="datepicker_td week_point2">22</div>
                                  </div>
    
                                  <div className="datepicker_row">
                                    <div className="datepicker_td week_point">23</div>
                                    <div className="datepicker_td">24</div>
                                    <div className="datepicker_td">25</div>
                                    <div className="datepicker_td">26</div>
                                    <div className="datepicker_td">27</div>
                                    <div className="datepicker_td">28</div>
                                    <div className="datepicker_td week_point2">29</div>
                                  </div>
    
                                  <div className="datepicker_row">
                                    <div className="datepicker_td week_point">30</div>
                                    <div className="datepicker_td">31</div>
                                  </div>
    
    
                                </div>
                              </div>
                            </div> */}

                        <div className="adm_date_endbox">
                          <div className="alarm_select_chk round_chk">
                            <input
                              type="checkbox"
                              name="allChk"
                              id="all_term"
                              className="all_chk"
                              checked=""
                            />
                            <label for="all_term" className="adm_datelabel">
                              종료일 없음
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="selectBox adm_datepicker active">
                        {/* <div className="select_first">종료일</div> */}
                        <div className="select_value2">2022. 4. 15. (금)</div>

                        <div className="datepicker_box2">
                          <div className="datepicker_header">
                            <div className="date_prev"></div>
                            <div className="date_hd_box">
                              <div className="date_year">2022년</div>
                              <div className="date_month">4월</div>
                            </div>
                            <div className="date_next"></div>
                          </div>

                          <div className="datepicker_body">
                            <div className="datepicker_tbl">
                              <div className="datepicker_row">
                                <div className="datepicker_td week_point">
                                  일
                                </div>
                                <div className="datepicker_td">월</div>
                                <div className="datepicker_td">화</div>
                                <div className="datepicker_td">수</div>
                                <div className="datepicker_td">목</div>
                                <div className="datepicker_td">금</div>
                                <div className="datepicker_td week_point2">
                                  일
                                </div>
                              </div>

                              <div className="datepicker_row">
                                <div className="datepicker_td date_disalbed week_point">
                                  26
                                </div>
                                <div className="datepicker_td date_disalbed">
                                  27
                                </div>
                                <div className="datepicker_td date_disalbed">
                                  28
                                </div>
                                <div className="datepicker_td date_disalbed">
                                  29
                                </div>
                                <div className="datepicker_td date_disalbed">
                                  30
                                </div>
                                <div className="datepicker_td date_disalbed">
                                  31
                                </div>
                                <div className="datepicker_td date_disalbed week_point2">
                                  1
                                </div>
                              </div>

                              <div className="datepicker_row">
                                <div className="datepicker_td date_disalbed week_point">
                                  2
                                </div>
                                <div className="datepicker_td">3</div>
                                <div className="datepicker_td">4</div>
                                <div className="datepicker_td on">5</div>
                                <div className="datepicker_td">6</div>
                                <div className="datepicker_td">7</div>
                                <div className="datepicker_td week_point2">
                                  8
                                </div>
                              </div>

                              <div className="datepicker_row">
                                <div className="datepicker_td week_point">
                                  9
                                </div>
                                <div className="datepicker_td">10</div>
                                <div className="datepicker_td">11</div>
                                <div className="datepicker_td">12</div>
                                <div className="datepicker_td">13</div>
                                <div className="datepicker_td">14</div>
                                <div className="datepicker_td week_point2">
                                  15
                                </div>
                              </div>

                              <div className="datepicker_row">
                                <div className="datepicker_td week_point">
                                  16
                                </div>
                                <div className="datepicker_td">17</div>
                                <div className="datepicker_td">18</div>
                                <div className="datepicker_td">19</div>
                                <div className="datepicker_td">20</div>
                                <div className="datepicker_td">21</div>
                                <div className="datepicker_td week_point2">
                                  22
                                </div>
                              </div>

                              <div className="datepicker_row">
                                <div className="datepicker_td week_point">
                                  23
                                </div>
                                <div className="datepicker_td">24</div>
                                <div className="datepicker_td">25</div>
                                <div className="datepicker_td">26</div>
                                <div className="datepicker_td">27</div>
                                <div className="datepicker_td">28</div>
                                <div className="datepicker_td week_point2">
                                  29
                                </div>
                              </div>

                              <div className="datepicker_row">
                                <div className="datepicker_td week_point">
                                  30
                                </div>
                                <div className="datepicker_td">31</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul className="adm_inputList2">
              <li className="adm_inputItem2">
                <button
                  type="button"
                  className="invite_cancle_B invite_btn"
                  disabled
                >
                  취소
                </button>
              </li>
              <li className="adm_inputItem2">
                <button
                  type="button"
                  href=""
                  className="invite_ok_btn invite_btn"
                  disabled
                >
                  저장
                </button>
              </li>
            </ul>
          </div>

          <div className="adm_bodyBox2">
            <div className="adm_table">
              <div className="col_group">
                <div className="col6"></div>
              </div>
              <div className="adm_thead">
                <div className="adm_row">
                  <div className="adm_th">
                    <p className="tbl_center">반이름</p>
                  </div>
                  <div className="adm_th">
                    <p>운영기간</p>
                  </div>
                  <div className="adm_th">
                    <p></p>
                  </div>
                </div>
              </div>

              <div className="adm_tbody">
                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>

                <div className="adm_row">
                  <div className="adm_td">
                    <p className="tbl_center">구름반</p>
                  </div>
                  <div className="adm_td">
                    <p>2022. 2. 28. (월) - 2023. 2. 28. (화)</p>
                  </div>
                  <div className="adm_td">
                    <div className="td_more">
                      <img src="/imgs/icon-more-fill-grey-t.png" />

                      {/* <ul className="post_setting_list">
                            <li className="post_setting_item">
                              <a href="#">수정</a>
                            </li>
                            <li className="post_setting_item">
                              <a href="#">삭제</a>
                            </li>
                          </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="adm_noneBox">
                  <p>등록된 원아가 없습니다.</p>
                </div> */}
            <div className="invite_excess">
              <p>반 정보가 변경되었습니다.</p>
            </div>
          </div>
          <div className="pagination_Box">
            <div className="page_item on">
              <p>1</p>
            </div>
            <div className="page_item">
              <p>2</p>
            </div>
            <div className="page_item">
              <p>3</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
