package com.appintent.firewall.network

import com.google.gson.annotations.SerializedName

data class AppModel(
    @SerializedName("_id") val id: String,
    val name: String,
    val packageName: String
)

data class AnalysisRequest(
    val appId: String,
    val permission: String,
    val context: String
)

data class AnalysisResponse(
    @SerializedName("app") val appName: String,
    val permission: String,
    val context: String,
    val riskScore: Int,
    val riskLevel: String,
    val recommendation: String,
    val reasons: List<String>
)
