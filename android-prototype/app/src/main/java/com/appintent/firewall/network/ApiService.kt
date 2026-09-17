package com.appintent.firewall.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @GET("/api/apps")
    suspend fun getApps(): Response<List<AppModel>>

    @POST("/api/analysis/analyze")
    suspend fun analyzeRequest(@Body request: AnalysisRequest): Response<AnalysisResponse>
}
